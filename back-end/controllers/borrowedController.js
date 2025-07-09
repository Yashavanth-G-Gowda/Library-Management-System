import IssuedBookModel from '../models/issueBookModel.js';
import UserModel from '../models/userModel.js';
import BookModel from '../models/bookModel.js';

const getAllIssuedBooks = async (req, res) => {
  try {
    const issuedBooks = await IssuedBookModel.find();

    const enrichedData = await Promise.all(
      issuedBooks.map(async (issue) => {
        const user = await UserModel.findOne({ srn: issue.srn });
        const book = await BookModel.findOne({ isbn: issue.isbn });

        return {
          srn: issue.srn,
          name: user?.name || 'Unknown',
          bookNumber: issue.issuedBookNumber,
          isbn: issue.isbn,
          title: book?.title || 'Unknown',
          author: book?.author || 'Unknown',
          issuedDate: issue.issuedDate || 'N/A',     // ✅ Corrected field name
          returnDate: issue.returnDate || 'N/A'
        };
      })
    );

    return res.status(200).json({ success: true, data: enrichedData });

  } catch (error) {
    console.error("📛 Error fetching issued books:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch issued books." });
  }
};

const returnBook = async (req, res) => {
  const { srn, bookNumber } = req.body;

  if (!srn || !bookNumber) {
    return res.status(400).json({ success: false, message: "SRN and Book Number are required." });
  }

  try {
    // 1. Remove from IssuedBookModel
    const removed = await IssuedBookModel.findOneAndDelete({ srn, issuedBookNumber: bookNumber });
    if (!removed) {
      return res.status(404).json({ success: false, message: "Issued book not found." });
    }

    // 2. Update book availability
    await BookModel.findOneAndUpdate(
      { isbn: removed.isbn },
      {
        $pull: { issuedBookNumbers: bookNumber },
        $addToSet: { availableBookNumbers: bookNumber },
      }
    );

    // 3. Remove from user.borrowedBooks
    const user = await UserModel.findOne({ srn });
    if (user) {
      user.booksBorrowed.delete(bookNumber);
      await user.save();
    }

    return res.status(200).json({ success: true, message: "Book returned successfully." });

  } catch (err) {
    console.error("Return Book Error:", err);
    return res.status(500).json({ success: false, message: "Server error during return." });
  }
};

export { getAllIssuedBooks, returnBook };