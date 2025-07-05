import mongoose from "mongoose";

const booksSchema = new mongoose.Schema({
  title: { type: String, required: true },
  edition: { type: Number, required: true },
  author: { type: String, required: true },
  branch: { type: [String], required: true },
  copies: { type: Number, required: true },
  bookNumbers: { type: [String], required: true },             // All unique book IDs
  availableBookNumbers: { type: [String], required: true },    // Available to issue
  issuedBookNumbers: { type: [String], default: [] },          // Currently issued
  publisher: { type: String, required: false },                // Optional publisher
  year: { type: Number, required: false },                     // Optional published year
  image: { type: String, required: true },
  location: {
    shelf: { type: String, required: true },
    row: { type: String, required: true }
  }
}, { timestamps: true });

// Virtual status field
booksSchema.virtual('status').get(function () {
  return this.copies === 0 ? 'unavailable' : 'available';
});

// Include virtuals in JSON output if needed
booksSchema.set('toJSON', { virtuals: true });

const BookModel = mongoose.model("Books", booksSchema) || mongoose.models.Books;

export default BookModel;