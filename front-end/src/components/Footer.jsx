// Footer.jsx
import React, { useContext } from 'react';
import { ArrowUp } from 'lucide-react';
import { assets } from '../assets/assets';
import { UserContext } from '../context/UserContext';

const Footer = () => {
  const { setIsFeedbackVisible } = useContext(UserContext);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-[#f26522] text-white px-4 py-8 sm:py-6 sm:px-10">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        {/* Logo */}
        <div className="mb-3 sm:mb-0">
          <img
            src={assets.jssstulogo}
            alt="JSS STU Logo"
            className="h-16 sm:h-20 object-contain"
          />
        </div>

        {/* Copyright */}
        <div className="text-center sm:text-right text-sm sm:text-base">
          Copyright © JSS STU 2025. All rights reserved.
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 sm:mt-0 flex justify-center sm:justify-end gap-4">
        <button
          onClick={() => setIsFeedbackVisible(true)}
          className="bg-white text-[#f26522] px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm"
        >
          Give Feedback
        </button>
        <button
          onClick={scrollToTop}
          className="text-white hover:text-gray-200 sm:hidden"
          aria-label="Scroll to top"
        >
          <ArrowUp />
        </button>
      </div>
    </footer>
  );
};

export default Footer;