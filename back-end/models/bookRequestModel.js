import mongoose from 'mongoose';

const bookRequestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  requestedBy: { type: [String], default: [] }, // SRNs of users who requested
  count: { type: Number, default: 1 },
}, { timestamps: true });

const BookRequestModel = mongoose.models.BookRequest || mongoose.model('BookRequest', bookRequestSchema);

export default BookRequestModel; 