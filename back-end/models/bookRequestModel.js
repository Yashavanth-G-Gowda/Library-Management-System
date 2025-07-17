import mongoose from 'mongoose';

const bookRequestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  requestedBy: [{ type: String }], // SRNs or user IDs
  count: { type: Number, default: 1 }
}, { timestamps: true });

const BookRequestModel = mongoose.models.BookRequest || mongoose.model('BookRequest', bookRequestSchema);
export default BookRequestModel;
