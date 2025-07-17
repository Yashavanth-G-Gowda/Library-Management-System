import IssuedBookModel from '../models/issueBookModel.js';
import UserModel from '../models/userModel.js';
import BookModel from '../models/bookModel.js';
import BookRequestModel from '../models/bookRequestModel.js';
import ReturnedBookModel from '../models/returnedBookModel.js';
import sendEmail from '../config/sendEmail.js';

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
    // 1. Find and remove from IssuedBookModel
    const removed = await IssuedBookModel.findOneAndDelete({ srn, issuedBookNumber: bookNumber });
    if (!removed) {
      return res.status(404).json({ success: false, message: "Issued book not found." });
    }

    // 1.5. Save to ReturnedBookModel
    await ReturnedBookModel.create({
      srn: removed.srn,
      issuedBookNumber: removed.issuedBookNumber,
      isbn: removed.isbn,
      issuedDate: removed.issuedDate,
      returnDate: removed.returnDate,
      returnedAt: new Date()
    });

    // 2. Update book availability
    const updatedBook = await BookModel.findOneAndUpdate(
      { isbn: removed.isbn },
      {
        $pull: { issuedBookNumbers: bookNumber },
        $addToSet: { availableBookNumbers: bookNumber },
      },
      { new: true }
    );

    // 3. Remove from user.borrowedBooks
    const user = await UserModel.findOne({ srn });
    if (user) {
      user.booksBorrowed.delete(bookNumber);
      // Patch: Ensure userType exists to avoid validation error
      if (!user.userType) user.userType = 'student';
      await user.save();
    }

    // 3.5 Send confirmation email to the person who returned the book
    if (user && user.email) {
      const subject = `📚 Book Return Confirmation: ${updatedBook.title}`;
      const text = `Hi ${user.name},

Thank you for returning the book "${updatedBook.title}" to the SJCE Library.

Return Date: ${new Date().toLocaleDateString('en-GB')}

We appreciate your timely return. You can now borrow another book if needed.

Best regards,
SJCE Library Team`;

      const html = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; line-height: 1.6;">
          <p>Hi <strong>${user.name}</strong>,</p>

          <p>Thank you for returning the following book to the SJCE Library:</p>

          <ul>
            <li><strong>Title:</strong> ${updatedBook.title}</li>
            <li><strong>Author:</strong> ${updatedBook.author}</li>
            <li><strong>Return Date:</strong> ${new Date().toLocaleDateString('en-GB')}</li>
          </ul>

          <p>We appreciate your timely return! You can now borrow another book if needed.</p>

          <p>If you have any questions or need assistance, feel free to reach out to the SJCE Library staff.</p>

          <p>Best regards,<br/>
          <strong>SJCE Library Team</strong><br/>
          JSS Science and Technology University</p>

          <hr style="margin-top: 20px;" />
          <p style="font-size: 12px; color: #999; text-align: center;">
            This is an automated message. Please do not reply.
          </p>
        </div>
      `;

      await sendEmail({ to: user.email, subject, text, html });
      console.log("Return confirmation email sent successfully");
    }

    // 4. If book is now available, notify all users who requested it and delete the request
    if (updatedBook && updatedBook.availableBookNumbers.length > 0) {
      // Find matching book requests (normalize for lookup)
      const reqTitle = updatedBook.title.trim().toLowerCase();
      const reqAuthor = updatedBook.author.trim().toLowerCase();
      const requests = await BookRequestModel.find({ title: reqTitle, author: reqAuthor });
      for (const request of requests) {
        for (const srn of request.requestedBy) {
          const notifyUser = await UserModel.findOne({ srn });
          if (notifyUser && notifyUser.email) {
            const subject = `Book Now Available: ${updatedBook.title}`;
            const text = `Hi ${notifyUser.name || notifyUser.srn},\n\nThe book "${updatedBook.title}" by ${updatedBook.author} is now available in the library.\n\nPlease visit the library to borrow it.\n\n- SJCE Library Team`;
            const html = `<p>Hi <strong>${notifyUser.name || notifyUser.srn}</strong>,</p><p>The book <strong>"${updatedBook.title}"</strong> by ${updatedBook.author} is now <span style='color:green;font-weight:bold;'>available</span> in the library.</p><p>Please visit the library to borrow it.</p><p>- SJCE Library Team</p>`;
            await sendEmail({ to: notifyUser.email, subject, text, html });
          }
        }
        // Delete the request after notifying
        await BookRequestModel.findByIdAndDelete(request._id);
      }
    }

    return res.status(200).json({ success: true, message: "Book returned successfully." });

  } catch (err) {
    console.error("Return Book Error:", err);
    return res.status(500).json({ success: false, message: "Server error during return." });
  }
};

export { getAllIssuedBooks, returnBook };