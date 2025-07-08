import React from 'react';
import { assets } from '../assets/assets'; // Adjust path if needed

const UserInformation = ({ user, onClose }) => {
  const profileImage = user.image || assets.profile_icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="relative w-[90%] max-w-md bg-white rounded-2xl shadow-2xl px-6 py-8 animate-fadeIn">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-black text-2xl"
        >
          ✕
        </button>

        {/* Profile Image */}
        <div className="flex justify-center mb-4">
          <img
            src={profileImage}
            alt="User"
            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg ring-4 ring-blue-100"
          />
        </div>

        {/* Info Section */}
        <div className="text-center text-sm text-gray-700 space-y-2">
          <p><span className="font-semibold text-gray-800">SRN:</span> {user.srn}</p>
          <p><span className="font-semibold text-gray-800">Name:</span> {user.name}</p>
          <p><span className="font-semibold text-gray-800">Semester:</span> {user.sem}</p>
          <p><span className="font-semibold text-gray-800">Branch:</span> {user.branch}</p>
          <p><span className="font-semibold text-gray-800">Email:</span> {user.email}</p>
          <p><span className="font-semibold text-gray-800">Phone:</span> {user.phone}</p>
        </div>
      </div>
    </div>
  );
};

export default UserInformation;
