import React from 'react';
import { assets } from '../assets/assets';

const LogoutConfirmation = ({ onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-40">
      <div className="bg-white rounded-md p-6 w-11/12 max-w-sm flex gap-4 shadow-xl">
        
        {/* Left Side: Icon */}
        <div className="w-16 h-16 border rounded-full flex items-center justify-center">
            <img
                src={assets.avatar}
                alt="Logout"
                className="w-10 h-10 object-contain rounded-full"
            />
        </div>

        {/* Right Side */}
        <div className="flex flex-col flex-1 text-sm text-gray-800">
          <p className="font-semibold text-base mb-1">Confirm Logout</p>
          <p className="text-gray-600 mb-4">Are you sure you want to logout from Admin Panel?</p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-1 border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmation;