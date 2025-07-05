import validator from 'validator'
import UserModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET)
}

// Route for login user
const loginUser = async (req, res) => {
  try {
    const { srn, password } = req.body;

    if (!srn || !password) {
      return res.json({ success: false, message: "SRN and password are required" });
    }

    // Check only SRN
    const user = await UserModel.findOne({ srn });

    if (!user) {
      return res.json({ success: false, message: "No user found with this SRN" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    const token = createToken(user._id);
    return res.json({ success: true, token });

  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: "Login failed. Please try again." });
  }
};

// Route for registered user
const registerUser = async(req,res) => {
    try {
        const {srn, email, password} = req.body;
        console.log("BODY", req.body);
        const emailExists = await UserModel.findOne({email});
        const srnExists = await UserModel.findOne({srn});
        if(emailExists || srnExists) {
            if(emailExists) {
                return res.json({success:false, message: "Email is already associated with another user!"})
            }
            if(srnExists) {
                return res.json({success:false, message: "SR number is already registered by an user!"})
            }
        }
        if(!validator.isEmail(email)){
            return res.json({success:false, message: "Please enter a valid Email address!!"})
        }
        if(password.length < 8) {
            return res.json({success:false, message: "Please enter a strong password!!"})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new UserModel({
            srn,
            email,
            password: hashedPassword // ✅ correct field name and value
        });
        const user = await newUser.save();
        const token = createToken(user._id);

        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.message})
    }
}

// Route to get Single user details
const getUserDetails = async (req, res) => {
  try {
    const token = req.headers.token;
    if (!token) return res.json({ success: false, message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id).select('-password'); // ✅ use UserModel

    if (!user) return res.json({ success: false, message: 'User not found' });
    res.json({ success: true, user }); // ✅ use res.json()
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

const updateUserDetails = async (req, res) => {
  try {
    const userId = req.userId; // Provided by middleware
    const { name, email, phone, branch, sem } = req.body;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { name, email, phone, branch, sem },
      { new: true }
    );

    if (!updatedUser) {
      return res.json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User profile updated successfully', 
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.json({ success: false, message: 'Failed to update profile' });
  }
}

export {loginUser, registerUser, getUserDetails, updateUserDetails} 