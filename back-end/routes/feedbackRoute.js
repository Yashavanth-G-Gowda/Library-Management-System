import express from 'express';
import { submitFeedback, listFeedback } from '../controllers/feedbackController.js';

const feedbackRouter = express.Router();

feedbackRouter.post('/', submitFeedback);
feedbackRouter.get('/', listFeedback);

export default feedbackRouter; 