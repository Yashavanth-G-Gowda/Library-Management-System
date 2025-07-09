// models/IssueBookModel.js
import mongoose from 'mongoose';

// Helper to format date as MM-DD-YYYY
function getFormattedDate(offsetDays = 0) {
  const now = new Date();
  now.setDate(now.getDate() + offsetDays); // offset by X days (e.g., 15 for return)
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const yyyy = now.getFullYear();
  return `${mm}-${dd}-${yyyy}`;
}

const IssueBookSchema = new mongoose.Schema({
  srn: {
    type: String,
    required: true,
    unique: true
  },
  issuedBookNumber: {
    type: String,
    required: true,
    unique: true
  },
  isbn: {
    type: String,
    required: true
  },
  issuedDate: {
    type: String,
    default: () => getFormattedDate() // today
  },
  returnDate: {
    type: String,
    default: () => getFormattedDate(15) // today + 15 days
  }
}, {
  timestamps: true
});

const IssueBookModel = mongoose.models.IssuedBook || mongoose.model('IssuedBook', IssueBookSchema);

export default IssueBookModel;