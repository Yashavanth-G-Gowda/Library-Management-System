import express from 'express'
import adminAuth from '../middleware/adminAuth.js'
import { addBooks, deleteBooks, listBooks, checkISBN, getBookByNumber, getBookByISBN, editBook, getNewlyArrivedBooks, getBookRecommendations } from '../controllers/bookController.js';
import upload from '../middleware/multer.js'

const bookRouter = express.Router()

bookRouter.post(
  '/addbooks',
  adminAuth,
  upload.fields([{ name: 'image', maxCount: 1 }]),
  addBooks
);
bookRouter.get('/allBooks', listBooks);
bookRouter.get('/newly-arrived', getNewlyArrivedBooks);
bookRouter.get('/recommendations', getBookRecommendations);
bookRouter.delete('/delete/:id', deleteBooks);
bookRouter.post('/deleteSelected', adminAuth, deleteBooks);
bookRouter.post('/checkISBN', adminAuth, checkISBN);
bookRouter.get('/number/:bookNumber', getBookByNumber);
bookRouter.get('/isbn/:isbn', getBookByISBN);
bookRouter.put('/edit/:isbn', upload.single('image'), adminAuth, editBook);

export default bookRouter 