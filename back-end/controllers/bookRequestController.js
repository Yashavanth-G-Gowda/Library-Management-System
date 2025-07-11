import BookRequestModel from '../models/bookRequestModel.js';
import BookModel from '../models/bookModel.js';

// POST: Add or update a book request
export const addBookRequest = async (req, res) => {
  try {
    let { title, author, srn } = req.body;
    if (!title || !author || !srn) {
      return res.status(400).json({ success: false, message: 'Title, author, and SRN are required.' });
    }
    // Normalize for lookup
    title = title.trim().toLowerCase();
    author = author.trim().toLowerCase();
    // Check if request for this book already exists
    let request = await BookRequestModel.findOne({ title, author });
    if (request) {
      // If user already requested, don't increment count
      if (!request.requestedBy.includes(srn)) {
        request.count += 1;
        request.requestedBy.push(srn);
        await request.save();
      }
    } else {
      request = new BookRequestModel({
        title,
        author,
        requestedBy: [srn],
        count: 1
      });
      await request.save();
    }
    return res.status(201).json({ success: true, request });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// DELETE: Remove all book requests
export const deleteAllBookRequests = async (req, res) => {
  try {
    await BookRequestModel.deleteMany({});
    return res.status(200).json({ success: true, message: 'All book requests deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// GET: List all book requests, sorted by count desc, enriched with image and branch
export const listBookRequests = async (req, res) => {
  try {
    const requests = await BookRequestModel.find().sort({ count: -1, updatedAt: -1 });
    // Enrich with image and branch if book exists
    const enriched = await Promise.all(requests.map(async (req) => {
      // Try to find book with case-insensitive matching
      const book = await BookModel.findOne({
        title: { $regex: new RegExp(`^${req.title}$`, 'i') },
        author: { $regex: new RegExp(`^${req.author}$`, 'i') }
      });
      
      return {
        _id: req._id,
        title: req.title,
        author: req.author,
        count: req.count,
        image: book?.image || '',
        branch: book?.branch || [],
      };
    }));
    return res.status(200).json({ success: true, requests: enriched });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
}; 