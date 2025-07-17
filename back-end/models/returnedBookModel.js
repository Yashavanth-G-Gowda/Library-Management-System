import mongoose from 'mongoose';

const ReturnedBookSchema = new mongoose.Schema({
  srn: { type: String, required: true },
  issuedBookNumber: { type: String, required: true },
  isbn: { type: String, required: true },
  issuedDate: { type: String, required: true },
  returnDate: { type: String, required: true },
  returnedAt: { type: Date, default: Date.now },
}, {
  timestamps: true
});

const ReturnedBookModel = mongoose.models.ReturnedBook || mongoose.model('ReturnedBook', ReturnedBookSchema);
export default ReturnedBookModel; 