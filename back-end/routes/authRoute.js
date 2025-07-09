import express from 'express'
import { sendOtp, verifyOtp } from '../controllers/otpController.js'

const authRouter = new express.Router()

authRouter.post('/send-otp', sendOtp);
authRouter.post('/verify-otp', verifyOtp);

export default authRouter