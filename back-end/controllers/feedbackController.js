import FeedbackModel from '../models/feedbackModel.js';

import UserModel from '../models/userModel.js';

// POST: Submit feedback
export const submitFeedback = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.userId; // Provided by auth middleware
    
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    // Get user details from database
    const user = await UserModel.findById(userId).select('name srn email');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const feedback = new FeedbackModel({ 
      message, 
      user: {
        name: user.name,
        srn: user.srn,
        email: user.email
      }
    });
    await feedback.save();
    return res.status(201).json({ success: true, feedback });
  } catch (err) {
    console.error('Feedback submission error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// GET: List feedback, sorted by date, with optional filter
export const listFeedback = async (req, res) => {
  try {
    const { range } = req.query; // 'week', 'month', '3months', 'year', 'all'
    let filter = {};
    if (range && range !== 'all') {
      const now = new Date();
      let fromDate;
      if (range === 'week') {
        fromDate = new Date(now.setDate(now.getDate() - 7));
      } else if (range === 'month') {
        fromDate = new Date(now.setMonth(now.getMonth() - 1));
      } else if (range === '3months') {
        fromDate = new Date(now.setMonth(now.getMonth() - 3));
      } else if (range === 'year') {
        fromDate = new Date(now.setFullYear(now.getFullYear() - 1));
      }
      filter.createdAt = { $gte: fromDate };
    }
    const feedbacks = await FeedbackModel.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, feedbacks });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
}; 