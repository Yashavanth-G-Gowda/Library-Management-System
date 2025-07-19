import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReturnConfirmation from '../component/ReturnConfirmation';

const BorrowedBooks = ({ token }) => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const fetchBorrowedBooks = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/admin/borrowed-books`, {
        headers: { token },
      });

      if (res.data.success) {
        const sorted = res.data.data.sort(
          (a, b) => new Date(b.issuedDate) - new Date(a.issuedDate)
        );
        setBorrowedBooks(sorted);
        setFilteredBooks(sorted);
      } else {
        toast.error('Failed to load issued books');
      }
    } catch (err) {
      toast.error('Server error while fetching issued books');
      console.error('Axios Error:', err);
    }
  };

  useEffect(() => {
    fetchBorrowedBooks();
  }, [token]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = borrowedBooks.filter((book) => {
      const srnMatch = book.srn.toLowerCase().includes(value.toLowerCase());
      const isbnMatch = book.isbn.toLowerCase().includes(value.toLowerCase());
      const bookNumberMatch = book.bookNumber.toLowerCase().includes(value.toLowerCase());
      const titleMatch = book.title?.toLowerCase().includes(value.toLowerCase()); // ✅ added

      return srnMatch || isbnMatch || bookNumberMatch || titleMatch;
    });

    setFilteredBooks(filtered);
  };


  const confirmReturn = async () => {
    if (!selectedBook) return;
    try {
      const res = await axios.put(
        `${backendURL}/api/admin/return-book`,
        { srn: selectedBook.srn, bookNumber: selectedBook.bookNumber },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success('Book returned successfully');
        fetchBorrowedBooks();
      } else {
        toast.error(res.data.message || 'Return failed');
      }
    } catch (err) {
      toast.error('Server error during return');
      console.error('Return Book Error:', err);
    } finally {
      setShowModal(false);
      setSelectedBook(null);
    }
  };

  const handleReturnClick = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  // Helper to format date as dd-mm-yyyy
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
    // If ISO or other format
    const dateObj = new Date(dateStr);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="p-6">
      {/* 🔍 Search Bar */}
      <div className="mb-6 flex justify-center">
        <div className="relative w-full max-w-md">
          {/* 🔍 Icon */}
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm select-none">
            🔍
          </span>

          {/* Input */}
          <input
            type="text"
            placeholder="Search by SRN, ISBN, or Book Number"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-9 pr-10 py-2 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all duration-200"
          />

          {/* ❌ Clear Button */}
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilteredBooks(borrowedBooks);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition"
            >
              ✖
            </button>
          )}
        </div>
      </div>

      {/* 📋 Borrowed Books Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">SRN</th>
              <th className="p-3 border">Book ISBN</th>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Book Number</th>
              <th className="p-3 border">Issued Date</th>
              <th className="p-3 border">Return Date</th>
              <th className="p-3 border">Fine Amount</th>
              <th className="p-3 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-3 border">{book.srn}</td>
                  <td className="p-3 border">{book.isbn}</td>
                  <td className="p-3 border">{book.title}</td>
                  <td className="p-3 border">{book.bookNumber}</td>
                  <td className="p-3 border">{formatDate(book.issuedDate)}</td>
                  <td className="p-3 border">{formatDate(book.returnDate)}</td>
                  <td className="p-3 border">{typeof book.fine === 'number' ? `₹${book.fine}` : (book.fine ? `₹${book.fine}` : '-')}</td>
                  <td className="p-3 border text-center">
                    <button
                      onClick={() => handleReturnClick(book)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs"
                    >
                      Return
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No matching borrowed books found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <ReturnConfirmation
          book={selectedBook}
          onConfirm={confirmReturn}
          onCancel={() => {
            setShowModal(false);
            setSelectedBook(null);
          }}
        />
      )}
    </div>
  );
};

export default BorrowedBooks;