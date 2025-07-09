import express from 'express'
import {loginUser, registerUser, getUserDetails, updateUserDetails, adminLogin, getAllUsers, getUserBySRN} from '../controllers/userController.js'
import authUser from '../middleware/auth.js';

const userRouter = express.Router()

userRouter.post("/login",loginUser);
userRouter.post("/register",registerUser)
userRouter.post("/userDetails", getUserDetails)
userRouter.put("/userUpdate", authUser, updateUserDetails)
userRouter.post('/admin',adminLogin)
userRouter.get('/allusers', getAllUsers);
userRouter.get('/usersrn/:srn', getUserBySRN);

export default userRouter