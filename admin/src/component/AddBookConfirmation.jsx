import React from 'react';

const AddBookConfirmation = ({ existingBook, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md max-w-md shadow-lg flex gap-4">
        <img
          src={existingBook.image}
          alt="book"
          className="w-24 h-32 object-cover rounded border"
        />
        <div className="flex flex-col justify-between">
          <p className="font-semibold text-gray-800 mb-2">
            Book with same ISBN exists in inventory.
          </p>
          <p className="text-xs text-gray-500 mb-2">
            Do you still want to add the new book numbers?
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="px-3 py-1 bg-gray-300 rounded text-sm hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Confirm
            </button>
          </div>
          <p className="text-[10px] text-red-500 italic mt-4">
            Note: Only <strong>unique book numbers</strong> will be appended. Duplicates will be ignored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddBookConfirmation;