import sendEmail from "../config/sendEmail.js";

const sendTestEmail = async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    await sendEmail({ to, subject, text });
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error sending email' });
  }
};

export {sendTestEmail}