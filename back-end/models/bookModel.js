import mongoose from "mongoose";

const booksSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    edition: { type: Number, required: true },
    author: { type: String, required: true },
    branch: { type: [String], required: true },

    copies: { type: Number }, // auto-calculated, not required from frontend

    bookNumbers: { type: [String], required: true },
    availableBookNumbers: {
      type: [String],
      validate: {
        validator: Array.isArray,
        message: 'availableBookNumbers must be an array'
      }
    },
    issuedBookNumbers: { type: [String], default: [] },

    publisher: { type: String },
    year: { type: Number },

    image: { type: String, required: true },

    location: {
      shelf: { type: String, required: true },
      row: { type: String, required: true }
    },

    tags: { type: Array }
  },
  { timestamps: true }
);

// ✅ Auto-set availableBookNumbers = bookNumbers if not given
booksSchema.pre('save', function (next) {
  if (!this.availableBookNumbers || this.availableBookNumbers.length === 0) {
    this.availableBookNumbers = [...this.bookNumbers];
  }

  this.copies = this.availableBookNumbers.length;
  next();
});

// ✅ Recalculate copies on update
booksSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();

  if (update.bookNumbers && (!update.availableBookNumbers || update.availableBookNumbers.length === 0)) {
    update.availableBookNumbers = [...update.bookNumbers];
  }

  if (update.availableBookNumbers) {
    update.copies = update.availableBookNumbers.length;
  }

  this.setUpdate(update);
  next();
});

// 📌 Virtual 'status' field (available/unavailable)
booksSchema.virtual('status').get(function () {
  return this.availableBookNumbers?.length > 0 ? 'available' : 'unavailable';
});

// Include virtuals in toJSON output
booksSchema.set('toJSON', { virtuals: true });

const BookModel = mongoose.models.Books || mongoose.model("Books", booksSchema);

export default BookModel;