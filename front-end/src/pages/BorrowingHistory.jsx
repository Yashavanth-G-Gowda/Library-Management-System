import React, { useState, useContext, useEffect } from 'react';
import { FaHistory, FaCalendarAlt, FaBook, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { assets } from '../assets/assets';

const backendURL = import.meta.env.VITE_BACKEND_URL;

const BorrowingHistory = () => {
  const { token, userInfo } = useContext(UserContext);
  const [returnedBooks, setReturnedBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBorrowingHistory = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const res = await axios.post(`${backendURL}/api/user/borrowingHistory`, {}, {
        headers: { token }
      });
      
      if (res.data.success && res.data.returnedBooks) {
        // Fetch book details for each returned book
        const booksWithDetails = await Promise.all(
          res.data.returnedBooks.map(async (returnedBook) => {
            try {
              const bookRes = await axios.get(`${backendURL}/api/books/isbn/${returnedBook.isbn}`);
              if (bookRes.data.success) {
                return {
                  ...returnedBook,
                  bookDetails: bookRes.data.book
                };
              }
              return returnedBook;
            } catch (err) {
              console.error('Error fetching book details:', err);
              return returnedBook;
            }
          })
        );
        setReturnedBooks(booksWithDetails);
      } else {
        setReturnedBooks([]);
      }
    } catch (err) {
      console.error('Error fetching borrowing history:', err);
      setReturnedBooks([]);
    } finally {
      setLoading(false);
    }
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

  useEffect(() => {
    fetchBorrowingHistory();
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
            <FaHistory className="text-2xl text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Borrowing History</h1>
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
              <p className="text-sm text-gray-600">Total Books Returned: {returnedBooks.length}</p>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={fetchBorrowingHistory}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <FaHistory />
            Refresh
          </button>
        </div>

        {/* Books List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your borrowing history...</p>
          </div>
        ) : returnedBooks.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {returnedBooks.map((returnedBook, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  <img
                    src={returnedBook.bookDetails?.image || assets.book_placeholder}
                    alt={returnedBook.bookDetails?.title || 'Book'}
                    className="w-16 h-20 object-cover rounded shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {returnedBook.bookDetails?.title || 'Unknown Book'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Author:</span> {returnedBook.bookDetails?.author || 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      <span className="font-medium">Book #:</span> {returnedBook.issuedBookNumber}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <FaCalendarAlt className="text-blue-500" />
                        <span className="text-gray-600">
                          <span className="font-medium">Issued:</span> {formatDate(returnedBook.issuedDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FaCalendarAlt className="text-green-500" />
                        <span className="text-green-600 font-medium">
                          <span className="font-medium">Due:</span> {formatDate(returnedBook.returnDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FaBook className="text-gray-500" />
                        <span className="text-gray-600">
                          <span className="font-medium">Status:</span> 
                          <span className="text-green-600 font-medium ml-1">Returned</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <FaHistory className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Borrowing History</h3>
            <p className="text-gray-500">You haven't borrowed any books yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowingHistory; 