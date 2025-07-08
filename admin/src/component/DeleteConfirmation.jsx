import React, { useState } from 'react';

const getOrdinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
};

const DeleteConfirmation = ({ book, onCancel, onConfirm }) => {
  const [selectedBookNumbers, setSelectedBookNumbers] = useState([]);
  const [deleteAll, setDeleteAll] = useState(false);

  const handleCheckboxChange = (bookNumber) => {
    setSelectedBookNumbers((prev) =>
      prev.includes(bookNumber)
        ? prev.filter((bn) => bn !== bookNumber)
        : [...prev, bookNumber]
    );
  };

  const handleRadioChange = (value) => {
    setDeleteAll(value === 'all');
    if (value === 'all') setSelectedBookNumbers([]); // clear selections if deleting all
  };

  const handleConfirm = () => {
    onConfirm({
      all: deleteAll,
      bookNumbers: deleteAll ? [] : selectedBookNumbers,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-md shadow-xl w-11/12 max-w-2xl flex gap-5">
        {/* Left: Book Image */}
        <img
          src={book.image}
          alt={book.title}
          className="w-24 h-32 object-cover rounded-md border"
        />

        {/* Right: Book Info and Selection */}
        <div className="flex flex-col flex-1 text-sm text-gray-800 overflow-hidden">
          <p className="font-semibold text-base leading-tight line-clamp-2">{book.title}</p>
          <p className="text-gray-600 text-sm mt-1 truncate">{book.author}</p>
          <p className="text-gray-500 mt-1">{getOrdinal(book.edition)} Edition</p>

          {/* Book Number Checkboxes */}
          <div className="mt-3">
            <p className="font-medium text-sm mb-1">Select Book Numbers to Delete:</p>
            <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto pr-1">
              {book.bookNumbers
                .slice() // create a copy to avoid mutating the original array
                .sort((a, b) => a.localeCompare(b, undefined, { numeric: true })) // handles numeric sorting
                .map((num, index) => (
                  <label key={index} className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={selectedBookNumbers.includes(num)}
                      onChange={() => handleCheckboxChange(num)}
                      disabled={deleteAll}
                    />
                    <span className="truncate">{num}</span>
                  </label>
                ))}
            </div>
          </div>

          {/* Delete Option Radios */}
          <div className="mt-3 space-y-1 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="deleteOption"
                checked={deleteAll}
                onChange={() => handleRadioChange('all')}
              />
              Delete <strong>all</strong> books of "{book.title}"
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="deleteOption"
                checked={!deleteAll}
                onChange={() => handleRadioChange('selected')}
              />
              Delete <strong>selected</strong> book numbers only
            </label>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-1 border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              disabled={!deleteAll && selectedBookNumbers.length === 0}
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;