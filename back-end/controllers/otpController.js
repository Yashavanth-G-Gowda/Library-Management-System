import nodemailer from 'nodemailer';
import otpMap from '../config/otpStore.js';

const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  // Store OTP in memory
  otpMap.set(email, { otp, expiresAt });

  // Create mail transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });

  const mailOptions = {
    from: `"Library Auth" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP for login is ${otp}. It will expire in 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'OTP sent successfully.' });
  } catch (error) {
    console.error("❌ OTP Email Error:", error);
    return res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};

const verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Email and OTP are required" });
  }

  const entry = otpMap.get(email);

  if (!entry) {
    return res.status(400).json({ success: false, message: "No OTP sent to this email" });
  }

  if (Date.now() > entry.expiresAt) {
    otpMap.delete(email);
    return res.status(400).json({ success: false, message: "OTP expired" });
  }

  if (entry.otp !== otp) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  // ✅ OTP valid
  otpMap.delete(email); // cleanup
  return res.status(200).json({ success: true, message: "OTP verified successfully" });
};

export { sendOtp, verifyOtp }