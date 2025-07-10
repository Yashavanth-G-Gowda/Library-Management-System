import BookModel from "../models/bookModel.js";
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import UserModel from "../models/userModel.js";
import sendEmail from "../config/sendEmail.js";

const addBooks = async (req, res) => {
  try {
    const {
      title, edition, author, isbn, publisher, year,
      tags, bookNumbers, branches, location, confirmed
    } = req.body;

    if (!title || !isbn || !bookNumbers) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const parsedTags = JSON.parse(tags || '[]');
    const parsedNumbers = JSON.parse(bookNumbers || '[]');
    const parsedBranches = JSON.parse(branches || '[]');
    const parsedLocation = JSON.parse(location || '{}');
    const isConfirmed = JSON.parse(confirmed || 'false');

    // 🔍 Check for duplicate ISBN
    const existingBook = await BookModel.findOne({ isbn });

    if (existingBook && !isConfirmed) {
      return res.json({ duplicate: true, book: existingBook });
    }

    if (existingBook && isConfirmed) {
      const existingSet = new Set(existingBook.bookNumbers);
      const newBookNumbers = parsedNumbers.filter(bn => !existingSet.has(bn));
      existingBook.bookNumbers.push(...newBookNumbers);
      existingBook.availableBookNumbers.push(...newBookNumbers);
      await existingBook.save();
      return res.json({ success: true, message: "Book numbers appended to existing book." });
    }

    // ☁️ Upload image to Cloudinary (optional fallback)
    let image = '';
    try {
      if (req?.files?.image?.[0]?.path) {
        const result = await cloudinary.uploader.upload(req.files.image[0].path, {
          folder: 'library_books',
        });
        image = result.secure_url;
      } else if (req.body.imageURL) {
        image = req.body.imageURL;
      }
    } catch (uploadErr) {
      console.error("❌ Image upload failed:", uploadErr.message);
    }

    // 🧾 Create and save new book
    const newBook = new BookModel({
      title,
      edition,
      author,
      isbn,
      publisher,
      year,
      tags: parsedTags,
      bookNumbers: parsedNumbers,
      availableBookNumbers: parsedNumbers,
      branch: parsedBranches,
      location: parsedLocation,
      image,
    });

    await newBook.save();

    // 📧 Email notification to users
    try {
      const usersToNotify = await UserModel.find(
        { branch: { $in: parsedBranches } },
        'email name'
      );

      const subject = '📚 New Book Added to SJCE Library';
      const html = `
        <div style="font-family:sans-serif;">
          <h2>New Book Available in the Library!</h2>
          <p>Dear Student/Faculty,</p>
          <p>We are excited to announce a new addition to the SJCE Library collection:</p>
          <ul>
            <li><b>Title:</b> ${title}</li>
            <li><b>Author:</b> ${author}</li>
            <li><b>Edition:</b> ${edition}</li>
            <li><b>ISBN:</b> ${isbn}</li>
            <li><b>Publisher:</b> ${publisher || 'N/A'}</li>
            <li><b>Year:</b> ${year || 'N/A'}</li>
            <li><b>Branches:</b> ${parsedBranches.join(', ')}</li>
          </ul>
          <p>Visit the library or our portal to borrow this book.</p>
          <p>📖 Happy Reading!<br/>SJCE Library Team</p>
          <hr/>
          <small>This is an automated message. Please do not reply.</small>
        </div>`;

      for (const user of usersToNotify) {
        if (user.email) {
          await sendEmail({
            to: user.email,
            subject,
            html,
            text: `New Book: ${title} by ${author}, Edition: ${edition} has been added to SJCE Library.`
          });
        }
      }
    } catch (emailErr) {
      console.error('❌ Email Notification Error:', emailErr.message);
    }

    return res.json({ success: true, message: "New book added successfully!" });

  } catch (err) {
    console.error("❌ Fatal Error in addBooks:", err);
    return res.status(500).json({ success: false, message: "Server error while adding book." });
  }
};

// Route to list all the books
const listBooks =async(req, res) => {
  try {
    const books = await BookModel.find();
    res.json({ success: true, books });
  } catch (error) {
    console.error("Error fetching books:", error.message);
    res.json({ success: false, message: "Internal Server Error" });
  }
}

const deleteBooks = async (req, res) => {
  try {
    const { id, bookNumbers = [], all = false } = req.body;

    const book = await BookModel.findById(id);
    if (!book) {
      return res.json({ success: false, message: "Book not found" });
    }

    // Delete all copies of the book
    if (all) {
      await BookModel.findByIdAndDelete(id);
      return res.json({ success: true, message: "All copies of the book deleted successfully." });
    }

    // Delete selected bookNumbers
    const updatedBookNumbers = book.bookNumbers.filter(bn => !bookNumbers.includes(bn));
    const updatedAvailable = book.availableBookNumbers.filter(bn => !bookNumbers.includes(bn));

    // If no copies remain, delete the book entirely
    if (updatedBookNumbers.length === 0) {
      await BookModel.findByIdAndDelete(id);
      return res.json({ success: true, message: "All selected books deleted. No copies remain." });
    }

    // Otherwise, update the book
    book.bookNumbers = updatedBookNumbers;
    book.availableBookNumbers = updatedAvailable;
    await book.save();

    return res.json({ success: true, message: "Selected copies deleted successfully." });

  } catch (error) {
    console.error("Error deleting book(s):", error.message);
    return res.status(500).json({ success: false, message: "Error deleting selected book(s)." });
  }
};

const checkISBN = async (req, res) => {
  const { isbn } = req.body;

  if (!isbn) {
    return res.status(400).json({ success: false, message: "ISBN is required" });
  }

  try {
    const book = await BookModel.findOne({ isbn });
    if (book) {
      return res.json({ success: true, book });
    } else {
      return res.json({ success: false, message: "No book with this ISBN found." });
    }
  } catch (err) {
    console.error("checkISBN error:", err);
    return res.status(500).json({ success: false, message: "Error checking ISBN" });
  }
};

const getBookByNumber = async (req, res) => {
  const { bookNumber } = req.params;

  try {
    const book = await BookModel.findOne({
      $or: [
        { availableBookNumbers: bookNumber },
        { issuedBookNumbers: bookNumber }
      ]
    });

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found." });
    }

    return res.status(200).json({ success: true, book });

  } catch (err) {
    console.error("Get Book Error:", err);
    return res.status(500).json({ success: false, message: "Server error while fetching book." });
  }
};

const getBookByISBN = async (req, res) => {
  const { isbn } = req.params;

  try {
    const book = await BookModel.findOne({ isbn });

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found." });
    }

    return res.status(200).json({ success: true, book });

  } catch (err) {
    console.error("Get Book by ISBN Error:", err);
    return res.status(500).json({ success: false, message: "Server error while fetching book." });
  }
};

// Route to get newly arrived books (last 30 days)
const getNewlyArrivedBooks = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newlyArrivedBooks = await BookModel.find({
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: -1 }).limit(10);
    
    res.json({ success: true, books: newlyArrivedBooks });
  } catch (error) {
    console.error("Error fetching newly arrived books:", error.message);
    res.json({ success: false, message: "Internal Server Error" });
  }
};

// Route to get book recommendations based on user history
const getBookRecommendations = async (req, res) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.json({ success: false, message: 'No token provided' });
    }

    const jwt = await import('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id).select('-password');

    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    // Get user's borrowed books history
    const userBorrowedBooks = [];
    if (user.booksBorrowed && user.booksBorrowed.size > 0) {
      for (const [bookNumber, bookData] of user.booksBorrowed.entries()) {
        const book = await BookModel.findOne({ isbn: bookData.isbn });
        if (book) {
          userBorrowedBooks.push(book);
        }
      }
    }

    // Extract tags and authors from user's history
    const userTags = new Set();
    const userAuthors = new Set();
    const userBranches = new Set();

    userBorrowedBooks.forEach(book => {
      if (book.tags) {
        book.tags.forEach(tag => userTags.add(tag));
      }
      if (book.author) {
        userAuthors.add(book.author);
      }
      if (book.branch) {
        book.branch.forEach(branch => userBranches.add(branch));
      }
    });

    // Find books with similar tags, authors, or branches
    const recommendations = await BookModel.find({
      $and: [
        { _id: { $nin: userBorrowedBooks.map(book => book._id) } }, // Exclude already borrowed
        {
          $or: [
            { tags: { $in: Array.from(userTags) } },
            { author: { $in: Array.from(userAuthors) } },
            { branch: { $in: Array.from(userBranches) } }
          ]
        }
      ]
    }).limit(10);

    // If not enough recommendations, add some popular books
    if (recommendations.length < 5) {
      const popularBooks = await BookModel.find({
        _id: { $nin: [...userBorrowedBooks.map(book => book._id), ...recommendations.map(book => book._id)] }
      }).limit(10 - recommendations.length);
      
      recommendations.push(...popularBooks);
    }

    res.json({ success: true, books: recommendations });
  } catch (error) {
    console.error("Error fetching book recommendations:", error.message);
    res.json({ success: false, message: "Internal Server Error" });
  }
};

const editBook = async (req, res) => {
  try {
    const { isbn } = req.params;
    const updateData = req.body;

    // Remove undefined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    // Handle image upload if provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'library_books',
      });
      updateData.image = result.secure_url;
      
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
    }

    const updatedBook = await BookModel.findOneAndUpdate(
      { isbn },
      updateData,
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    res.json({ success: true, message: "Book updated successfully", book: updatedBook });
  } catch (error) {
    console.error("Error updating book:", error.message);
    res.status(500).json({ success: false, message: "Error updating book" });
  }
};

export { addBooks, deleteBooks, listBooks, checkISBN, getBookByNumber, getBookByISBN, editBook, getNewlyArrivedBooks, getBookRecommendations };