import React, { useRef, useState, useContext, useEffect } from 'react';
import { FaEdit, FaChevronDown, FaChevronUp, FaBook, FaCalendarAlt, FaRupeeSign } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserContext } from '../context/UserContext';
import { assets } from '../assets/assets';
import EditProfile from '../components/EditProfile';

const backendURL = import.meta.env.VITE_BACKEND_URL;

const MyProfile = () => {
  const fileInputRef = useRef(null);
  const {token, userInfo, setUserInfo } = useContext(UserContext);
  const [profileImage, setProfileImage] = useState(assets.profile_icon);
  const [showMore, setShowMore] = useState(false);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    branch: '',
    sem: '',
    designation: '',
    phone: '',
    email: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo?.image) setProfileImage(userInfo.image);
    if (userInfo) {
      setEditForm({
        name: userInfo.name || '',
        branch: userInfo.branch || '',
        sem: userInfo.sem || '',
        designation: userInfo.designation || '',
        phone: userInfo.phone || '',
        email: userInfo.email || ''
      });
    }
  }, [userInfo]);

  const fetchBorrowedBooks = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      console.log('Fetching borrowed books...');
      const res = await axios.post(`${backendURL}/api/user/userWithBooks`, {}, {
        headers: { token }
      });
      
      console.log('Response:', res.data);
      
      if (res.data.success && res.data.user.borrowedBooks) {
        console.log('Borrowed books found:', res.data.user.borrowedBooks);
        // Fetch book details for each borrowed book
        const booksWithDetails = await Promise.all(
          res.data.user.borrowedBooks.map(async (borrowedBook) => {
            try {
              const bookRes = await axios.get(`${backendURL}/api/books/isbn/${borrowedBook.isbn}`);
              if (bookRes.data.success) {
                return {
                  ...borrowedBook,
                  bookDetails: bookRes.data.book
                };
              }
              return borrowedBook;
            } catch (err) {
              console.error('Error fetching book details:', err);
              return borrowedBook;
            }
          })
        );
        console.log('Books with details:', booksWithDetails);
        setBorrowedBooks(booksWithDetails);
      } else {
        console.log('No borrowed books found or API error');
        setBorrowedBooks([]);
      }
    } catch (err) {
      console.error('Error fetching borrowed books:', err);
      setBorrowedBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const isOverdue = (returnDate) => {
    const today = new Date();
    const [month, day, year] = returnDate.split('-').map(Number);
    const dueDate = new Date(year, month - 1, day);
    return today > dueDate;
  };

  // Format mm-dd-yyyy to dd-mm-yyyy
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    let d, m, y;
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts[0].length === 4) {
        // yyyy-mm-dd
        [y, m, d] = parts;
      } else if (parts[2].length === 4) {
        // mm-dd-yyyy or dd-mm-yyyy
        [m, d, y] = parts;
        if (Number(m) > 12) [d, m] = [m, d];
      } else {
        [d, m, y] = parts;
      }
      return `${d.padStart(2, '0')}-${m.padStart(2, '0')}-${y}`;
    }
    // If ISO or other format
    const dateObj = new Date(dateStr);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const calculateTotalFine = () => {
    return borrowedBooks.reduce((total, book) => total + (book.fine || 0), 0);
  };

  useEffect(() => {
    fetchBorrowedBooks();
  }, [token]);

  // Listen for book issued event to refresh borrowed books
  useEffect(() => {
    const handleBookIssued = () => {
      fetchBorrowedBooks();
    };

    window.addEventListener('bookIssued', handleBookIssued);
    return () => {
      window.removeEventListener('bookIssued', handleBookIssued);
    };
  }, []);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfileImage(imageURL);
      // TODO: Upload image to backend/cloud
    }
  };

  const handleSave = () => {
    const updateData = {
      name: editForm.name,
      branch: editForm.branch,
      phone: editForm.phone,
      email: editForm.email
    };

    // Add semester for students or designation for faculty
    if (userInfo?.userType === 'student') {
      updateData.sem = editForm.sem;
    } else {
      updateData.designation = editForm.designation;
    }

    axios
      .put(`${backendURL}/api/user/userUpdate`, updateData, {headers: {token}})
      .then((res) => {
        if (res.data.success) {
          toast.success("Profile updated successfully");
          setUserInfo(res.data.user); // update frontend context
          setIsEditing(false);
        } else {
          toast.error(res.data.message || "Failed to update");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Something went wrong");
      });
  };

  return (
    <div className="p-4 rounded-xl max-w-md mx-auto">
      {/* Profile Image + Name */}
      <div className="flex items-center pl-4 space-x-4">
        <div
          onClick={handleImageClick}
          className="w-20 h-20 rounded-full overflow-hidden border cursor-pointer"
        >
          <img
            src={profileImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <div className="pl-4 flex flex-col text-left">
          <h2 className="text-lg mb-1 font-bold">{userInfo?.name || ''}</h2>
          <p className="text-sm font-semibold text-gray-600">{userInfo?.srn || 'SRN1234'}</p>
        </div>
      </div>

      {/* Buttons: Edit + More */}
      <div className="mt-4 flex justify-between items-center">
        <button
          className="flex items-center ml-6 gap-1 px-5 py-1 font-medium text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>

        <button
          onClick={() => setShowMore(!showMore)}
          className="flex items-center gap-1 px-2 mr-20 py-1 text-sm text-gray-700 underline"
        >
          {showMore ? 'Less' : 'More'}
          {showMore ? <FaChevronUp className="pt-1" /> : <FaChevronDown className="pt-1" />}
        </button>
      </div>

      {/* Additional Info */}
      {showMore && (
        <div className="mt-6 text-sm font-medium ml-7 space-y-2">
          <p><strong>Branch:</strong> {userInfo?.branch || 'Branch'}</p>
          {userInfo?.userType === 'student' ? (
            <p><strong>Semester:</strong> {userInfo?.sem || 'Semester'}</p>
          ) : (
            <p><strong>Designation:</strong> {userInfo?.designation || 'Designation'}</p>
          )}
          <p><strong>Phone:</strong> {userInfo?.phone || 'Phone number'}</p>
          <p><strong>Email:</strong> {userInfo?.email || 'email@example.com'}</p>
          {calculateTotalFine() > 0 && (
            <p className="text-red-600">
              <strong>Total Fine:</strong> ₹{calculateTotalFine()}
            </p>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <EditProfile
          editForm={editForm}
          setEditForm={setEditForm}
          onSave={handleSave}
          userType={userInfo?.userType || 'student'}
          onCancel={() => {
            setEditForm({
              name: userInfo.name || '',
              branch: userInfo.branch || '',
              sem: userInfo.sem || '',
              designation: userInfo.designation || '',
              phone: userInfo.phone || '',
              email: userInfo.email || ''
            });
            setIsEditing(false);
          }}
        />
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col gap-3">
        <button
          onClick={() => navigate('/borrowed-books')}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <FaBook />
          Borrowed Books
        </button>
        <button
          onClick={() => navigate('/borrowing-history')}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
        >
          <FaCalendarAlt />
          History
        </button>
      </div>
    </div>
  );
};

export default MyProfile;