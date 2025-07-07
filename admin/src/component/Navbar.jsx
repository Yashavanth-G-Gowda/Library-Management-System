import React from 'react';
import { assets } from '../assets/assets';

const Navbar = ({ setToken }) => {
  return (
    <div className='sticky top-0 z-50 flex items-center justify-between py-5 px-3 sm:px-6 h-[60px] sm:h-[70px] font-medium bg-white shadow-lg mb-2'>

      {/* Logo */}
      <a href="https://jssstuniv.in/#/" target="_blank" rel="noopener noreferrer">
        <img
          src={assets.logo}
          alt="JSSSTU"
          className="sm:w-[250px] sm:h-[65px] h-[58px] w-[150px] cursor-pointer"
        />
      </a>

      <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2 text-3xl font-bold text-gray-800 tracking-wide whitespace-nowrap">
        JSSSTU Library Admin Panel
      </div>
      <div className='flex flex-row gap-3'>
        {/* Logout Button */}
        <button
          onClick={() => setToken('')}
          className="bg-gray-600 text-white px-5 sm:px-7 py-2 rounded-full text-xs sm:text-sm hover:bg-red-500 transition-all"
        >
          Logout
        </button>

        {/* Notification Button */}
        <button
          className="bg-blue-500 text-white px-5 sm:px-7 py-2 rounded-full text-xs sm:text-sm hover:bg-blue-300 transition-all"
        >
          Notification
        </button>
      </div>
    </div>
  );
};

export default Navbar;