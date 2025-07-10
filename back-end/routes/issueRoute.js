import express from 'express'
import {issueBook} from '../controllers/issueController.js'
import { getAllIssuedBooks, returnBook } from '../controllers/borrowedController.js';
import { sendTestEmail } from '../controllers/emailController.js';
import adminAuth from '../middleware/adminAuth.js';

const issueRoute = express.Router();

issueRoute.post('/issue-book',adminAuth,issueBook)
issueRoute.get('/borrowed-books', adminAuth, getAllIssuedBooks);
issueRoute.put('/return-book', adminAuth, returnBook)
issueRoute.post('/sendmail', sendTestEmail);

export default issueRoute