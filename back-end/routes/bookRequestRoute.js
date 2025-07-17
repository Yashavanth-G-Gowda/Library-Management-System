import express from 'express';
import { addBookRequest, listBookRequests, deleteAllBookRequests } from '../controllers/bookRequestController.js';
import authUser from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const bookRequestRouter = express.Router();

// User submits a book request (requires authentication)
bookRequestRouter.post('/', authUser, addBookRequest);

// Admin fetches all book requests
bookRequestRouter.get('/', adminAuth, listBookRequests);

// Admin deletes all book requests
bookRequestRouter.delete('/', adminAuth, deleteAllBookRequests);

export default bookRequestRouter; 