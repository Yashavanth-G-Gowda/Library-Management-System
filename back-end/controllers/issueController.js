import IssuedBookModel from '../models/issueBookModel.js';
import BookModel from '../models/bookModel.js';
import UserModel from '../models/userModel.js';
import sendEmail from '../config/sendEmail.js';

const issueBook = async (req, res) => {
  const { srn, issuedBookNumber, isbn } = req.body;

  if (!srn || !issuedBookNumber || !isbn) {
    return res.status(400).json({
      success: false,
      message: "SRN, issuedBookNumber, and ISBN are required.",
    });
  }

  try {
    // 1️⃣ Check if user exists
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

    // 4️⃣ Prevent issuing already issued book number
    const alreadyIssued = await IssuedBookModel.findOne({ issuedBookNumber });
    if (alreadyIssued) {
      return res.status(409).json({
        success: false,
        message: `This book (${issuedBookNumber}) is already issued.`,
      });
    }

    // 5️⃣ Limit to 3 books per SRN
    const issuedCount = await IssuedBookModel.countDocuments({ srn });
    if (issuedCount >= 3) {
      return res.status(403).json({
        success: false,
        message: `User already has ${issuedCount} issued books. Limit is 3.`,
      });
    }

    // 5️⃣.5 Prevent same ISBN being issued twice to same user
    const sameISBNIssued = await IssuedBookModel.findOne({ srn, isbn });
    if (sameISBNIssued) {
      return res.status(409).json({
        success: false,
        message: `User already has a book with ISBN ${isbn} issued.`,
      });
    }

    // 6️⃣ Create the issued record
    const newIssued = new IssuedBookModel({ srn, issuedBookNumber, isbn });
    await newIssued.save();

    // 7️⃣ Update book model (remove from available, add to issued)
    const updatedBook = await BookModel.findOneAndUpdate(
      { isbn },
      {
        $pull: { availableBookNumbers: issuedBookNumber },
        $addToSet: { issuedBookNumbers: issuedBookNumber },
      },
      { new: true }
    );

    // 8️⃣ Update user’s booksBorrowed map
    user.set(`booksBorrowed.${issuedBookNumber}`, {
      isbn,
      issuedDate: newIssued.issuedDate,
      returnDate: newIssued.returnDate,
    });
    await user.save();

    // 9️⃣ Send Gmail notification to the user
    if (user.email) {
      console.log(user.email);
      
      const subject = `📚 Book Issued: ${book.title}`;
      const text = `Hi ${user.name},

The book "${book.title}" has been issued to your library account.

Issued Date: ${newIssued.issuedDate}
Return Date: ${newIssued.returnDate}

Please return it on or before the due date to avoid fines.

Happy Reading!
- SJCE Library Team`;

      const html = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; line-height: 1.6;">
          <p>Hi <strong>${user.name}</strong>,</p>

          <p>We're happy to inform you that the following book has been issued to your library account:</p>

          <ul>
            <li><strong>Title:</strong> ${book.title}</li>
            <li><strong>Issued Date:</strong> ${newIssued.issuedDate}</li>
            <li><strong>Return Date:</strong> ${newIssued.returnDate}</li>
          </ul>

          <p>Please make sure to return the book on or before the return date to avoid any penalties.</p>

          <p>If you have any questions or need assistance, feel free to reach out to the SJCE Library staff.</p>

          <p>Happy Reading! 📚</p>

          <p>Warm regards,<br/>
          <strong>SJCE Library Team</strong><br/>
          JSS Science and Technology University</p>

          <hr style="margin-top: 20px;" />
          <p style="font-size: 12px; color: #999; text-align: center;">
            This is an automated message. Please do not reply.
          </p>
        </div>
      `;

      await sendEmail({ to: user.email, subject, text, html });
      console.log("Email send successfully");
    }

    // 🔟 Respond with success
    return res.status(201).json({
      success: true,
      message: "Book issued successfully and email sent.",
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