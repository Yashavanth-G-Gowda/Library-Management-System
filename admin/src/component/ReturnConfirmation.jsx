import React from 'react';

const ReturnConfirmation = ({ book, onConfirm, onCancel }) => {
  if (!book) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-80 max-w-full">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Confirm Return</h2>

        <div className="mb-4 text-sm text-gray-700">
          <p><span className="font-medium">Title:</span> {book.title}</p>
          <p><span className="font-medium">Book Number:</span> {book.bookNumber}</p>
          <p><span className="font-medium">SRN:</span> {book.srn}</p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-3 py-1 text-sm rounded bg-gray-300 hover:bg-gray-400 text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1 text-sm rounded bg-red-600 hover:bg-red-700 text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnConfirmation;