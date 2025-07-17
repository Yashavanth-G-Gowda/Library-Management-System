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
  
  console.log(`📧 OTP sent to ${email}: ${otp}`);

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
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Library Management System - OTP Verification</h2>
        <p>Your OTP code is: <strong style="font-size: 24px; color: #007bff;">${otp}</strong></p>
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't request this OTP, please ignore this email.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${email}: <${mailOptions.messageId}>`);
    return res.status(200).json({ success: true, message: 'OTP sent successfully.' });
  } catch (error) {
    console.error("❌ OTP Email Error:", error);
    // Remove the OTP from memory if email fails
    otpMap.delete(email);
    return res.status(500).json({ success: false, message: 'Failed to send OTP. Please check your email address.' });
  }
};

const verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  // Trim spaces for safety
  const trimmedEmail = email ? email.trim() : '';
  const trimmedOtp = otp ? otp.trim() : '';

  console.log(`🔍 Verifying OTP for email: '${trimmedEmail}', received OTP: '${trimmedOtp}'`);

  if (!trimmedEmail || !trimmedOtp) {
    return res.status(400).json({ success: false, message: "Email and OTP are required" });
  }

  const entry = otpMap.get(trimmedEmail);

  if (!entry) {
    console.log(`❌ No OTP found for ${trimmedEmail}`);
    return res.status(400).json({ success: false, message: "No OTP found for this email. This can happen if the OTP expired, the backend was restarted, or you requested a new OTP. Please request a new OTP and try again." });
  }

  console.log(`📧 Stored OTP for ${trimmedEmail}: '${entry.otp}', Expires: ${new Date(entry.expiresAt).toLocaleString()}`);
  console.log(`📧 Received OTP: '${trimmedOtp}'`);

  if (Date.now() > entry.expiresAt) {
    console.log(`⏰ OTP expired for ${email}`);
    otpMap.delete(email);
    return res.status(400).json({ success: false, message: "OTP has expired. Please request a new OTP." });
  }

  if (entry.otp !== otp) {
    console.log(`❌ Invalid OTP for ${email}. Expected: ${entry.otp}, Received: ${otp}`);
    return res.status(400).json({ success: false, message: "Invalid OTP. Please check and try again." });
  }

  // ✅ OTP valid
  console.log(`✅ OTP verified successfully for ${email}`);
  otpMap.delete(email); // cleanup
  return res.status(200).json({ success: true, message: "OTP verified successfully" });
};

export { sendOtp, verifyOtp }