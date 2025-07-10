import IssuedBookModel from '../models/issueBookModel.js';
import BookModel from '../models/bookModel.js';
import UserModel from '../models/userModel.js';
import nodemailer from 'nodemailer';

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
    // 1️⃣ Check if user exists FIRST
    const user = await UserModel.findOne({ srn });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // 2️⃣ Check if book exists
    const book = await BookModel.findOne({ isbn });
    if (!book) {
      return res.status(404).json({ success: false, message: "Book with given ISBN not found." });
    }

    // 3️⃣ Check if the book number is available
    if (!book.availableBookNumbers.includes(issuedBookNumber)) {
      return res.status(400).json({ success: false, message: "Book number not available." });
    }

    // 4️⃣ Prevent duplicate issue
    const alreadyIssued = await IssuedBookModel.findOne({ issuedBookNumber });
    if (alreadyIssued) {
      return res.status(409).json({
        success: false,
        message: `This book (${issuedBookNumber}) is already issued.`,
      });
    }

    // 5️⃣ Create IssuedBook record
    const newIssued = new IssuedBookModel({ srn, issuedBookNumber, isbn });
    await newIssued.save();

    // 6️⃣ Update BookModel
    const updatedBook = await BookModel.findOneAndUpdate(
      { isbn },
      {
        $pull: { availableBookNumbers: issuedBookNumber },
        $addToSet: { issuedBookNumbers: issuedBookNumber },
      },
      { new: true }
    );

    // 7️⃣ Update User booksBorrowed map
    user.set(`booksBorrowed.${issuedBookNumber}`, {
      isbn,
      issuedDate: newIssued.issuedDate,
      returnDate: newIssued.returnDate,
    });
    await user.save();

    // 8️⃣ Send email notification to user
    try {
      if (user.email) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
        const formatDate = (dateStr) => {
          if (!dateStr) return '';
          let d, m, y;
          if (dateStr.includes('-')) {
            const parts = dateStr.split('-');
            if (parts[0].length === 4) {
              [y, m, d] = parts;
            } else if (parts[2].length === 4) {
              [m, d, y] = parts;
              if (Number(m) > 12) [d, m] = [m, d];
            } else {
              [d, m, y] = parts;
            }
            return `${d.padStart(2, '0')}-${m.padStart(2, '0')}-${y}`;
          }
          return dateStr;
        };
        const mailOptions = {
          from: `SJCE Library <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: 'Book Issued: SJCE Library',
          html: `<div style="font-family:sans-serif;">
            <h2>Book Issued Successfully!</h2>
            <p>Dear <b>${user.name || user.srn}</b>,</p>
            <p>Your book has been issued from the SJCE Library. Here are the details:</p>
            <ul>
              <li><b>Title:</b> ${book.title}</li>
              <li><b>Author:</b> ${book.author}</li>
              <li><b>Book Number:</b> ${issuedBookNumber}</li>
              <li><b>ISBN:</b> ${isbn}</li>
              <li><b>Issued Date:</b> ${formatDate(newIssued.issuedDate)}</li>
              <li><b>Due Date:</b> ${formatDate(newIssued.returnDate)}</li>
            </ul>
            <p>Please return the book on or before the due date to avoid fines.</p>
            <p>Thank you for using the SJCE Library!</p>
            <hr/>
            <small>This is an automated message. Please do not reply.</small>
          </div>`,
        };
        await transporter.sendMail(mailOptions);
      }
    } catch (emailErr) {
      console.error('Error sending issue notification email:', emailErr);
      // Do not fail the main request if email fails
    }

    return res.status(201).json({
      success: true,
      message: "Book issued successfully.",
      issuedBook: newIssued,
      updatedBook,
      updatedUser: user,
    });

  } catch (error) {
    console.error("📛 Issue Book Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while issuing the book.",
    });
  }
};

export { issueBook };