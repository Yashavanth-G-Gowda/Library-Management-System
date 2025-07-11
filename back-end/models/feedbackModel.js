import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  message: { type: String, required: true },
  user: {
    name: String,
    srn: String,
    email: String,
  },
}, { timestamps: true });

const FeedbackModel = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);

export default FeedbackModel; 