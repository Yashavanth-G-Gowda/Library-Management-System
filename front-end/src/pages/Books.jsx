// src/pages/Books.jsx
import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import ShowBooks from '../components/bookComponents/ShowBooks';

const Books = () => {
  const { deptCode } = useParams();
  const navigate = useNavigate();

  const { departments, books } = useContext(UserContext); // ✅ use books from context

  const department = departments.find((dept) => dept.code === deptCode);

  const departmentBooks = books.filter((book) => {
    // book.branch can be a string or array
    return Array.isArray(book.branch)
      ? book.branch.includes(deptCode)
      : book.branch === deptCode;
  });

  const handleBack = () => {
    navigate(-1); // 👈 goes back to previous page
  };

  if (!department) {
    return <div className="p-6 text-center text-red-600">Department not found.</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Mobile Back Button */}
      <div className="sm:hidden mb-4">
        <button
          onClick={handleBack}
          className="px-3 py-1.5 text-sm font-medium bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
        >
          &lt; back
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <img
            src={department.image}
            alt={department.name}
            className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg"
          />
          <div>
            <h2 className="text-lg sm:text-xl font-bold">{department.name}</h2>
            <p className="text-sm text-gray-600">{department.temp} Department</p>
          </div>
        </div>

        {/* Desktop Back Button */}
        <div className="hidden sm:block">
          <button
            onClick={handleBack}
            className="px-4 py-2 text-sm font-medium bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          >
            ⬅ Back to Collection
          </button>
        </div>
      </div>

      <h3 className="text-base sm:text-lg font-semibold mb-4">Books Available:</h3>

      {departmentBooks.length === 0 ? (
        <p className="text-gray-500">No books found for this department.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 pl-5 gap-4">
          {departmentBooks.map((book) => (
            <ShowBooks
              key={book._id}
              id={book._id}
              title={book.title}
              author={book.author}
              edition={book.edition}
              status={book.status}
              image={book.image}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Books;
