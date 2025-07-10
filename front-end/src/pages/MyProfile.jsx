import React, { useRef, useState, useContext, useEffect } from 'react';
import { FaEdit, FaChevronDown, FaChevronUp, FaBook, FaCalendarAlt, FaRupeeSign } from 'react-icons/fa';
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
    phone: '',
    email: ''
  });

  useEffect(() => {
    if (userInfo?.image) setProfileImage(userInfo.image);
    if (userInfo) {
      setEditForm({
        name: userInfo.name || '',
        branch: userInfo.branch || '',
        sem: userInfo.sem || '',
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
    // Accepts mm-dd-yyyy, yyyy-mm-dd, dd-mm-yyyy, etc.
    let d, m, y;
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts[0].length === 4) {
        // yyyy-mm-dd
        [y, m, d] = parts;
      } else if (parts[2].length === 4) {
        // mm-dd-yyyy or dd-mm-yyyy
        [m, d, y] = parts;
        if (Number(m) > 12) [d, m] = [m, d]; // swap if dd-mm-yyyy
      } else {
        [d, m, y] = parts;
      }
      return `${d.padStart(2, '0')}-${m.padStart(2, '0')}-${y}`;
    }
    return dateStr;
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
    axios
      .put(`${backendURL}/api/user/userUpdate`, editForm, {headers: {token}})
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
          <h2 className="text-lg mb-1 font-bold">{userInfo?.name || 'Demo User'}</h2>
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
          <p><strong>Semester:</strong> {userInfo?.sem || 'Semester'}</p>
          <p><strong>Phone:</strong> {userInfo?.phone || 'Phone number'}</p>
          <p><strong>Email:</strong> {userInfo?.email || 'email@example.com'}</p>
          {calculateTotalFine() > 0 && (
            <p className="text-red-600">
              <strong>Total Fine:</strong> ₹{calculateTotalFine()}
            </p>
          )}
        </div>
      )}

      <hr className="mt-6 mx-3 border-t-2 border-gray-300" />

      {/* Borrowed Books Section */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-4 ml-3">
          <FaBook className="text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Borrowed Books</h3>
          <button
            onClick={fetchBorrowedBooks}
            className="ml-auto mr-3 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-4 text-gray-500">Loading borrowed books...</div>
        ) : borrowedBooks.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {borrowedBooks.map((borrowedBook, index) => {
              console.log('BorrowedBook:', borrowedBook);
              return (
                <div key={index} className="bg-white rounded-lg shadow-sm border p-3 mx-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={borrowedBook.bookDetails?.image || assets.book_placeholder}
                      alt={borrowedBook.bookDetails?.title || 'Book'}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-800 truncate">
                        {borrowedBook.bookDetails?.title || 'Unknown Book'}
                      </h4>
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Book Number:</span> {borrowedBook.bookNumber}
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Author:</span> {borrowedBook.bookDetails?.author || 'Unknown'}
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt className="text-blue-500" />
                          <span className="text-gray-600">
                            <span className="font-medium">Issued:</span> {borrowedBook.issuedDate ? formatDate(borrowedBook.issuedDate) : 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt className={`${isOverdue(borrowedBook.returnDate) ? 'text-red-500' : 'text-orange-500'}`} />
                          <span className={`font-medium ${isOverdue(borrowedBook.returnDate) ? 'text-red-600' : 'text-orange-600'}`}>
                            {isOverdue(borrowedBook.returnDate) ? 'OVERDUE' : 'Due'}: {formatDate(borrowedBook.returnDate)}
                          </span>
                        </div>
                      </div>
                      {borrowedBook.fine > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <FaRupeeSign className="text-red-500 text-xs" />
                          <span className="text-xs text-red-600 font-medium">
                            Fine: ₹{borrowedBook.fine}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500 mx-3">
            No books currently borrowed
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <EditProfile
          editForm={editForm}
          setEditForm={setEditForm}
          onSave={handleSave}
          onCancel={() => {
            setEditForm({
              name: userInfo.name || '',
              branch: userInfo.branch || '',
              sem: userInfo.sem || '',
              phone: userInfo.phone || '',
              email: userInfo.email || ''
            });
            setIsEditing(false);
          }}
        />
      )}
    </div>
  );
};

export default MyProfile;