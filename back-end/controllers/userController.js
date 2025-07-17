import validator from 'validator'
import UserModel from "../models/userModel.js";
import IssueBookModel from "../models/issueBookModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'

const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET)
}

// Route for login user
const loginUser = async (req, res) => {
  try {
    const { srn, password, usertype } = req.body;

    if (!srn || !password) {
      return res.json({ success: false, message: "SRN and password are required" });
    }

    // First try to find user with userType (for new accounts)
    let user = await UserModel.findOne({ srn, userType: usertype });

    // If not found, try to find user without userType (for existing accounts)
    if (!user) {
      user = await UserModel.findOne({ srn, userType: { $exists: false } });
      
      // If found, update the user with the userType
      if (user) {
        console.log(`Updating existing user ${srn} with userType: ${usertype}`);
        user.userType = usertype;
        await user.save();
      }
    }

    if (!user) {
      return res.json({ success: false, message: `No ${usertype} found with this ${usertype === 'faculty' ? 'FR' : 'SR'} number` });
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
        const {srn, email, password, usertype} = req.body;
        console.log("BODY", req.body);
        
        if (!usertype || !['student', 'faculty'].includes(usertype)) {
            return res.json({success:false, message: "Invalid user type. Must be 'student' or 'faculty'"})
        }
        
        // Check for existing users more comprehensively
        const emailExists = await UserModel.findOne({email});
        const srnExists = await UserModel.findOne({srn});
        
        if(emailExists || srnExists) {
            if(emailExists) {
                return res.json({success:false, message: "Email is already associated with another user!"})
            }
            if(srnExists) {
                // Check if the existing user has a userType
                if (srnExists.userType) {
                    return res.json({success:false, message: `${usertype === 'faculty' ? 'FR' : 'SR'} number is already registered by a ${srnExists.userType}!`})
                } else {
                    // If existing user doesn't have userType, update it and return success
                    console.log(`Updating existing user ${srn} with userType: ${usertype}`);
                    srnExists.userType = usertype;
                    await srnExists.save();
                    const token = createToken(srnExists._id);
                    return res.json({ success: true, token, message: "Account updated successfully!" });
                }
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
            password: hashedPassword,
            userType: usertype
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
    const { name, email, phone, branch, sem, designation } = req.body;

    // Get current user to determine userType
    const currentUser = await UserModel.findById(userId);
    if (!currentUser) {
      return res.json({ success: false, message: 'User not found' });
    }

    // Prepare update object based on user type
    const updateData = { name, email, phone, branch };
    
    if (currentUser.userType === 'student') {
      updateData.sem = sem;
    } else {
      updateData.designation = designation;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      updateData,
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

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find(); // Fetch all users
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const getUserBySRN = async (req, res) => {
  const { srn } = req.params;

  try {
    const user = await UserModel.findOne({ srn });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("Get User Error:", err);
    return res.status(500).json({ success: false, message: "Server error while fetching user." });
  }
};

const getUserWithBorrowedBooks = async (req, res) => {
  try {
    const token = req.headers.token;
    if (!token) return res.json({ success: false, message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id).select('-password');

    if (!user) return res.json({ success: false, message: 'User not found' });

    // Convert booksBorrowed Map to array for easier frontend handling
    const borrowedBooks = [];
    if (user.booksBorrowed && user.booksBorrowed.size > 0) {
      for (const [bookNumber, bookData] of user.booksBorrowed.entries()) {
        // Calculate fine for overdue books
        let fine = 0;
        const today = new Date();
        const [month, day, year] = bookData.returnDate.split('-').map(Number);
        const dueDate = new Date(year, month - 1, day);
        
        if (today > dueDate) {
          const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
          fine = daysOverdue * 1; // ₹1 per day
        }

        borrowedBooks.push({
          bookNumber,
          isbn: bookData.isbn,
          issuedDate: bookData.issuedDate,
          returnDate: bookData.returnDate,
          fine: fine
        });
      }
    }

    res.json({ 
      success: true, 
      user: {
        ...user.toObject(),
        borrowedBooks
      }
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

const getUserBorrowingHistory = async (req, res) => {
  try {
    const token = req.headers.token;
    if (!token) return res.json({ success: false, message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id).select('-password');

    if (!user) return res.json({ success: false, message: 'User not found' });

    // Get all issued books for this user that are not currently borrowed
    const currentBorrowedBookNumbers = Array.from(user.booksBorrowed?.keys() || []);
    
    const issuedBooks = await IssueBookModel.find({ srn: user.srn });
    
    // Filter out currently borrowed books to get only returned books
    const returnedBooks = issuedBooks.filter(book => 
      !currentBorrowedBookNumbers.includes(book.issuedBookNumber)
    );

    res.json({ 
      success: true, 
      returnedBooks: returnedBooks
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

const adminLogin = async(req,res) => {
    try {
        const {userId,password} = req.body
        if(userId === process.env.ADMIN_USERID && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(userId+password,process.env.JWT_SECRET)
            res.json({success:true,token})
        }
        else {
            res.json({success:false,message:"Invalid credentials"})
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export {loginUser, registerUser, getUserDetails, updateUserDetails, adminLogin, getAllUsers, getUserBySRN, getUserWithBorrowedBooks, getUserBorrowingHistory} 