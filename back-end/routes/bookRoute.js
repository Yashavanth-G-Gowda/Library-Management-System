import express from 'express'
import adminAuth from '../middleware/adminAuth.js'
import { addBooks, deleteBooks, listBooks, checkISBN } from '../controllers/bookController.js';
import upload from '../middleware/multer.js'

const bookRouter = express.Router()

bookRouter.post(
  '/addbooks',
  adminAuth,
  upload.fields([{ name: 'image', maxCount: 1 }]),
  addBooks
);
bookRouter.get('/allBooks', listBooks);
bookRouter.delete('/delete/:id', deleteBooks);
bookRouter.post('/deleteSelected', adminAuth, deleteBooks);
bookRouter.post('/checkISBN', adminAuth, checkISBN);

export default bookRouter