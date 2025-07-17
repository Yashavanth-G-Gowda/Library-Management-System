import express from 'express';
import { submitFeedback, listFeedback } from '../controllers/feedbackController.js';
import authUser from '../middleware/auth.js';

const feedbackRouter = express.Router();

feedbackRouter.post('/', authUser, submitFeedback);
feedbackRouter.get('/', listFeedback);

export default feedbackRouter; 