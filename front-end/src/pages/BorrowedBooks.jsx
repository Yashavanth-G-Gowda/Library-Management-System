import React, { useState, useContext, useEffect } from 'react';
import { FaBook, FaCalendarAlt, FaRupeeSign, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { assets } from '../assets/assets';

const backendURL = import.meta.env.VITE_BACKEND_URL;

const BorrowedBooks = () => {
  const { token, userInfo } = useContext(UserContext);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBorrowedBooks = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const res = await axios.post(`${backendURL}/api/user/userWithBooks`, {}, {
        headers: { token }
      });
      
      if (res.data.success && res.data.user.borrowedBooks) {
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
        setBorrowedBooks(booksWithDetails);
      } else {
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

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    let d, m, y;
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts[0].length === 4) {
        [y, m, d] = parts;
      } else if (parts[2].length === 4) {
        [m, d, y] = parts;
        if (Number(m) > 12) [d, m] = [m, d];
      } else {
        [d, m, y] = parts;
      }
      return `${d.padStart(2, '0')}-${m.padStart(2, '0')}-${y}`;
    }
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
          >
            <FaArrowLeft />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-3">
            <FaBook className="text-2xl text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Currently Borrowed Books</h1>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{userInfo?.name || 'User'}</h2>
              <p className="text-gray-600">{userInfo?.srn || 'SRN'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Books: {borrowedBooks.length}</p>
              {calculateTotalFine() > 0 && (
                <p className="text-red-600 font-semibold">Total Fine: ₹{calculateTotalFine()}</p>
              )}
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={fetchBorrowedBooks}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <FaBook />
            Refresh
          </button>
        </div>

        {/* Books List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your borrowed books...</p>
          </div>
        ) : borrowedBooks.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {borrowedBooks.map((borrowedBook, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  <img
                    src={borrowedBook.bookDetails?.image || assets.book_placeholder}
                    alt={borrowedBook.bookDetails?.title || 'Book'}
                    className="w-16 h-20 object-cover rounded shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {borrowedBook.bookDetails?.title || 'Unknown Book'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Author:</span> {borrowedBook.bookDetails?.author || 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      <span className="font-medium">Book #:</span> {borrowedBook.bookNumber}
                    </p>
                    
                    <div className="flex flex-row gap-2">
                      <div className="flex items-center gap-2 text-sm">
                        <FaCalendarAlt className="text-blue-500" />
                        <span className="text-gray-600">
                          <span className="font-medium">Issued:</span> {formatDate(borrowedBook.issuedDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FaCalendarAlt className={`${isOverdue(borrowedBook.returnDate) ? 'text-red-500' : 'text-orange-500'}`} />
                        <span className={`font-medium ${isOverdue(borrowedBook.returnDate) ? 'text-red-600' : 'text-orange-600'}`}>
                          {isOverdue(borrowedBook.returnDate) ? 'OVERDUE' : 'Due'}: {formatDate(borrowedBook.returnDate)}
                        </span>
                      </div>
                      {borrowedBook.fine > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          <FaRupeeSign className="text-red-500" />
                          <span className="text-red-600 font-medium">
                            Fine: ₹{borrowedBook.fine}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Books Currently Borrowed</h3>
            <p className="text-gray-500">You haven't borrowed any books yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowedBooks; 