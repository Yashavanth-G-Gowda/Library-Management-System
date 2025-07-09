import React, { useState } from 'react';
import axios from 'axios';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';

const IssueBook = ({ token }) => {
  const [srn, setSrn] = useState('');
  const [bookNumber, setBookNumber] = useState('');
  const [isbn, setIsbn] = useState('');

  const [user, setUser] = useState(null);
  const [book, setBook] = useState(null);

  const [userError, setUserError] = useState('');
  const [bookError, setBookError] = useState('');

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const fetchUser = async () => {
    if (!srn.trim()) {
      setUser(null);
      setUserError('Please enter SRN');
      return;
    }
    try {
      const res = await axios.get(`${backendURL}/api/user/usersrn/${srn.trim()}`);
      if (res.data.success) {
        setUser(res.data.user);
        setUserError('');
      } else {
        setUser(null);
        setUserError('User not found.');
      }
    } catch (err) {
      console.error('User fetch error:', err);
      setUser(null);
      setUserError('User not found.');
    }
  };

  const fetchBook = async () => {
    if (!bookNumber.trim()) {
      setBook(null);
      setIsbn('');
      setBookError('Please enter Book Number');
      return;
    }
    try {
      const res = await axios.get(`${backendURL}/api/books/number/${bookNumber.trim()}`);
      if (res.data.success) {
        setBook(res.data.book);
        setIsbn(res.data.book.isbn || '');
        setBookError('');
      } else {
        setBook(null);
        setIsbn('');
        setBookError('Book not found.');
      }
    } catch (err) {
      console.error('Book fetch error:', err);
      setBook(null);
      setIsbn('');
      setBookError('Book not found.');
    }
  };

  const handleSubmit = async () => {
    if (!srn || !bookNumber || !isbn) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      const res = await axios.post(
        `${backendURL}/api/admin/issue-book`,
        {
          srn: srn.trim(),
          issuedBookNumber: bookNumber.trim(),
          isbn: isbn.trim(),
        },
        {
          headers: { token },
        }
      );

      if (res.data.success) {
        toast.success('Book issued successfully');
        setSrn('');
        setBookNumber('');
        setIsbn('');
        setUser(null);
        setBook(null);
        setUserError('');
        setBookError('');
      } else {
        toast.error(res.data.message || 'Failed to issue book');
      }
    } catch (err) {
      console.error("📛 Axios Error:", err?.response?.data || err.message);
      toast.error(err?.response?.data?.message || 'Failed to issue book');
    }
  };

  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      {/* Form Section */}
      <div className="bg-white rounded-lg shadow-md p-5 col-span-1">
        <h2 className="text-xl font-bold text-gray-700 mb-4">📘 ISSUE BOOK TO</h2>

        {/* SRN Input */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600 block mb-1">SRN</label>
          <input
            value={srn}
            onChange={(e) => setSrn(e.target.value)}
            placeholder="Enter SRN"
            className="w-full p-2 border rounded text-sm mb-2"
          />
          <div className="mb-1">
            <button
              type="button"
              onClick={fetchUser}
              className="text-xs bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
            >
              🔍 Find User
            </button>
          </div>
          {userError && <p className="text-red-500 text-xs">{userError}</p>}
        </div>

        {/* Book Number Input */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600 block mb-1">Book Number</label>
          <input
            value={bookNumber}
            onChange={(e) => setBookNumber(e.target.value)}
            placeholder="Enter Book Number"
            className="w-full p-2 border rounded text-sm mb-2"
          />
          <div className="mb-1">
            <button
              type="button"
              onClick={fetchBook}
              className="text-xs bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
            >
              🔍 Find Book
            </button>
          </div>
          {bookError && <p className="text-red-500 text-xs">{bookError}</p>}
        </div>

        {/* ISBN */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-600 block mb-1">ISBN (auto-filled)</label>
          <input
            value={isbn}
            placeholder="ISBN"
            readOnly
            className="w-full p-2 border rounded text-sm bg-gray-100 cursor-not-allowed"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm w-full"
        >
          Issue Book
        </button>
      </div>

      {/* Display Section */}
      <div className="col-span-2 grid grid-rows-2 gap-4">
        {/* User Info */}
        <div className="bg-white rounded-lg shadow-md p-5">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">👤 User Info</h3>
          {user ? (
            <div className="flex items-center gap-4">
              <img
                src={user.image || assets.profile_icon}
                className="w-20 h-20 object-cover rounded-full"
                alt="User"
              />
              <div className="text-sm space-y-1">
                <p><span className="font-medium">Name:</span> {user.name}</p>
                <p><span className="font-medium">SRN:</span> {user.srn}</p>
                <p><span className="font-medium">Branch:</span> {user.branch}</p>
                <p><span className="font-medium">Semester:</span> {user.sem}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Enter SRN and click "Find User".</p>
          )}
        </div>

        {/* Book Info */}
        <div className="bg-white rounded-lg shadow-md p-5">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">📗 Book Info</h3>
          {book ? (
            <div className="flex items-center gap-6">
              <img
                src={book.image || assets.book_placeholder}
                alt="Book"
                className="w-24 h-32 object-cover rounded"
              />
              <div className="text-sm space-y-2">
                <p className="text-base font-semibold text-gray-800">{book.title}</p>
                <p><span className="font-medium">ISBN:</span> {book.isbn}</p>
                <p><span className="font-medium">Author:</span> {book.author}</p>
                <p><span className="font-medium">Edition:</span> {book.edition}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Enter Book Number and click "Find Book".</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssueBook;