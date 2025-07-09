import BookModel from "../models/bookModel.js";
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

const addBooks = async (req, res) => {
  try {
    const {
      title, edition, author, isbn, publisher, year,
      tags, bookNumbers, branches, location, confirmed
    } = req.body;

    if (!title || !isbn || !bookNumbers) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    // ✅ Parse incoming fields
    const parsedTags = JSON.parse(tags || '[]');
    const parsedNumbers = JSON.parse(bookNumbers || '[]');
    const parsedBranches = JSON.parse(branches || '[]'); // ✅ fixed here
    const parsedLocation = JSON.parse(location || '{}');
    const isConfirmed = JSON.parse(confirmed || 'false');

    // ✅ Check for existing book
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

    // ----------------------------
    // 📤 Upload image to Cloudinary
    // ----------------------------
    let image = '';
    if (req?.files?.image?.[0]?.path) {
      const result = await cloudinary.uploader.upload(req.files.image[0].path, {
        folder: 'library_books',
      });
      image = result.secure_url;
    } else if (req.body.imageURL) {
      image = req.body.imageURL; // fallback if image URL is provided instead
    }

    // ✅ Create new book
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
      branch: parsedBranches, // ✅ stored into schema's `branch` field
      location: parsedLocation,
      image,
    });

    await newBook.save();
    return res.json({ success: true, message: "New book added successfully!" });

  } catch (err) {
    console.error("Error in addBooks:", err);
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

export { addBooks, listBooks, deleteBooks, checkISBN, getBookByNumber };