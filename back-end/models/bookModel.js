import mongoose from "mongoose";

const booksSchema = new mongoose.Schema({
  title: { type: String, required: true },
  edition: { type: Number, required: true },
  author: { type: String, required: true },
  branch: { type: String, required: true },
  copies: { type: Number, required: true },
  image: { type: String, required: true },
  location: {
    shelf: { type: String, required: true },
    row: { type: String, required: true }
  }
});

// Virtual status field
booksSchema.virtual('status').get(function () {
  return this.copies === 0 ? 'unavailable' : 'available';
});

// Include virtuals in JSON output if needed
booksSchema.set('toJSON', { virtuals: true });

const BookModel = mongoose.model("Books", booksSchema) || mongoose.models.Books;

export default BookModel;