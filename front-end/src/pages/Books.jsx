import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import ShowBooks from '../components/bookComponents/ShowBooks';
import ShowBookDetails from '../components/bookComponents/ShowBookDetails';

const Books = () => {
  const { deptCode } = useParams();
  const navigate = useNavigate();

  const { departments, books } = useContext(UserContext);
  const [selectedBook, setSelectedBook] = useState(null); // Modal state

  const department = departments.find((dept) => dept.code === deptCode);

  const departmentBooks = books.filter((book) =>
    Array.isArray(book.branch)
      ? book.branch.includes(deptCode)
      : book.branch === deptCode
  );

  const handleBack = () => navigate(-1);

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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 px-2 sm:px-4">
          {departmentBooks.map((book) => (
            <ShowBooks
              key={book._id}
              book={book}
              onClick={() => setSelectedBook(book)}
            />
          ))}
        </div>
      )}

      {/* Book Details Modal */}
      {selectedBook && (
        <ShowBookDetails
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
};

export default Books;
