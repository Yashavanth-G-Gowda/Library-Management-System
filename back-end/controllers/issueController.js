import IssuedBookModel from '../models/issueBookModel.js';
import BookModel from '../models/bookModel.js';
import UserModel from '../models/userModel.js';

const issueBook = async (req, res) => {
  const { srn, issuedBookNumber, isbn } = req.body;
  console.log(srn);
  
  if (!srn || !issuedBookNumber || !isbn) {
    return res.status(400).json({
      success: false,
      message: "SRN, issuedBookNumber, and ISBN are required.",
    });
  }

  try {
    // 1️⃣ Check book exists
    const book = await BookModel.findOne({ isbn });
    if (!book) {
      return res.status(404).json({ success: false, message: "Book with given ISBN not found." });
    }

    // 2️⃣ Check availability
    if (!book.availableBookNumbers.includes(issuedBookNumber)) {
      return res.status(400).json({ success: false, message: "Book number not available." });
    }

    // 3️⃣ Prevent duplicate issue
    const alreadyIssued = await IssuedBookModel.findOne({ issuedBookNumber });
    if (alreadyIssued) {
      return res.status(409).json({
        success: false,
        message: `This book (${issuedBookNumber}) is already issued.`,
      });
    }

    // 4️⃣ Create IssuedBook record
    const newIssued = new IssuedBookModel({ srn, issuedBookNumber, isbn });
    await newIssued.save();

    // 5️⃣ Update BookModel
    const updatedBook = await BookModel.findOneAndUpdate(
      { isbn },
      {
        $pull: { availableBookNumbers: issuedBookNumber },
        $addToSet: { issuedBookNumbers: issuedBookNumber },
      },
      { new: true }
    );

    // 6️⃣ Update User
    const user = await UserModel.findOne({ srn });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // ✅ Properly update Map using `.set`
    user.set(`booksBorrowed.${issuedBookNumber}`, {
      isbn,
      returnDate: newIssued.returnDate,
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "Book issued successfully.",
      issuedBook: newIssued,
      updatedBook,
      updatedUser: user,
    });

  } catch (error) {
    console.error("📛 Issue Book Error:", error);
    return res.status(500).json({ success: false, message: "Server error while issuing the book." });
  }
};

export { issueBook };