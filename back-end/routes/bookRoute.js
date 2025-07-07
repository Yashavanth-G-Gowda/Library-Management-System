import express from 'express'
import adminAuth from '../middleware/adminAuth.js'
import { addBooks } from '../controllers/bookController.js';
import upload from '../middleware/multer.js'

const bookRouter = express.Router()

bookRouter.post(
  '/addbooks',
  adminAuth,
  upload.fields([{ name: 'image', maxCount: 1 }]),
  addBooks
);


export default bookRouter