import UserModel from '../models/userModel.js';
import sendEmail from '../config/sendEmail.js';

const sendAdminNotification = async (req, res) => {
  try {
    const { message, departments } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }
    let users;
    if (departments && departments.length > 0) {
      // Extract department codes from names like 'Computer Science (CSE)' and convert to lowercase
      const deptCodes = departments.map(d => {
        const match = d.match(/\(([^)]+)\)/);
        return match ? match[1].toLowerCase() : d.toLowerCase();
      });
      console.log('Department codes to search for:', deptCodes);
      users = await UserModel.find({ branch: { $in: deptCodes } });
      console.log(`Found ${users.length} users for departments:`, deptCodes);
    } else {
      users = await UserModel.find();
      console.log(`Found ${users.length} total users`);
    }
    let sentCount = 0;
    for (const user of users) {
      if (user.email) {
        await sendEmail({
          to: user.email,
          subject: 'SJCE Library Notification',
          text: message,
          html: `<div style='font-family:sans-serif;'><p>${message}</p><hr/><small>SJCE Library Admin Notification</small></div>`
        });
        sentCount++;
      }
    }
    return res.status(200).json({ success: true, message: `Notification sent to ${sentCount} users.` });
  } catch (err) {
    console.error('Admin notification error:', err);
    return res.status(500).json({ success: false, message: 'Failed to send notification.' });
  }
};

export { sendAdminNotification };