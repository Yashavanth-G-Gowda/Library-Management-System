import BookModel from "../models/bookModel.js";
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

const addBooks = async (req, res) => {
  try {
    const {
      title,
      edition,
      author,
      branch,
      copies,
      bookNumbers,
      availableBookNumbers,
      publisher,
      year,
      location,
      tags,
      imageURL
    } = req.body;

    let image = '';

    // ✅ OPTION 1: User uploaded a file
    if (req.files?.image?.[0]) {
      const uploadedFile = req.files.image[0];

      const result = await cloudinary.uploader.upload(uploadedFile.path, {
        resource_type: 'image',
        folder: 'library-books',
      });

      image = result.secure_url;

      // ✅ Delete local file after upload to Cloudinary
      fs.unlink(uploadedFile.path, (err) => {
        if (err) {
          console.error("Error deleting local file:", err.message);
        }
      });
    }

    // ✅ OPTION 2: User provided an image URL
    else if (imageURL) {
      image = imageURL;
    }

    // ❌ No image given
    else {
      return res.json({
        success: false,
        message: "Please upload an image or provide an image URL",
      });
    }

    // 🧠 Parse stringified inputs
    const parsedBranches = typeof branch === 'string' ? JSON.parse(branch) : branch;
    const parsedBookNumbers = typeof bookNumbers === 'string' ? JSON.parse(bookNumbers) : bookNumbers;
    const parsedAvailable = typeof availableBookNumbers === 'string' ? JSON.parse(availableBookNumbers) : availableBookNumbers;
    const parsedTags = tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : [];
    const parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;

    // 📦 Create new book instance
    const newBook = new BookModel({
      title,
      edition,
      author,
      branch: parsedBranches,
      copies,
      bookNumbers: parsedBookNumbers,
      availableBookNumbers: parsedAvailable,
      issuedBookNumbers: [],
      publisher,
      year,
      image,
      location: parsedLocation,
      tags: parsedTags,
    });

    // 💾 Save to DB
    await newBook.save();

    return res.json({
      success: true,
      message: 'Book added successfully',
      book: newBook
    });

  } catch (error) {
    console.error("Add Book Error:", error);
    return res.json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

export { addBooks };