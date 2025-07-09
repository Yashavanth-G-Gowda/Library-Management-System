import mongoose from "mongoose";

const uniqueArrayValidator = (arr) => new Set(arr).size === arr.length;

const booksSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    edition: { type: Number, required: true },
    author: { type: String, required: true },
    isbn: { type: String, required: true },

    branch: { type: [String], required: true },

    bookNumbers: {
      type: [String],
      required: true,
      validate: {
        validator: uniqueArrayValidator,
        message: "bookNumbers must contain unique values",
      },
    },

    availableBookNumbers: {
      type: [String],
      required: true,
      validate: [
        {
          validator: Array.isArray,
          message: "availableBookNumbers must be an array",
        },
        {
          validator: uniqueArrayValidator,
          message: "availableBookNumbers must contain unique values",
        },
      ],
    },

    issuedBookNumbers: {
      type: [String],
      default: [],
      validate: {
        validator: uniqueArrayValidator,
        message: "issuedBookNumbers must contain unique values",
      },
    },

    publisher: { type: String },
    year: { type: Number },

    image: { type: String, required: true },

    location: {
      shelf: { type: String, required: true },
      row: { type: String, required: true },
    },

    tags: { type: Array, default: [] }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ✅ Virtual: Book status (based on availability)
booksSchema.virtual("status").get(function () {
  return this.availableBookNumbers?.length > 0 ? "available" : "unavailable";
});

// ✅ Export model
const BookModel = mongoose.models.Books || mongoose.model("Books", booksSchema);
export default BookModel;
