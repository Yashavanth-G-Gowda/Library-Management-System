import express from 'express'
import {loginUser, registerUser, getUserDetails, updateUserDetails, adminLogin, getAllUsers, getUserBySRN, getUserWithBorrowedBooks, getUserBorrowingHistory} from '../controllers/userController.js'
import { sendAdminNotification } from '../controllers/emailController.js';
import authUser from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const userRouter = express.Router()

userRouter.post("/login",loginUser);
userRouter.post("/register",registerUser)
userRouter.post("/userDetails", getUserDetails)
userRouter.post("/userWithBooks", getUserWithBorrowedBooks)
userRouter.post("/borrowingHistory", getUserBorrowingHistory)
userRouter.put("/userUpdate", authUser, updateUserDetails)
userRouter.post('/admin',adminLogin)
userRouter.get('/allusers', adminAuth, getAllUsers);
userRouter.get('/usersrn/:srn', getUserBySRN);
userRouter.post('/admin/notify', adminAuth, sendAdminNotification);

export default userRouter