import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.json({ success: false, message: "Not Authorized, Login Again" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // ✅ safer and cleaner
    next();
  } catch (error) {
    console.error("Auth Error:", error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;