import express from 'express';
import { addBookRequest, listBookRequests, deleteAllBookRequests } from '../controllers/bookRequestController.js';

const bookRequestRouter = express.Router();

// User submits a book request
bookRequestRouter.post('/', addBookRequest);

// Admin fetches all book requests
bookRequestRouter.get('/', listBookRequests);

// Admin deletes all book requests
bookRequestRouter.delete('/', deleteAllBookRequests);

export default bookRequestRouter; 