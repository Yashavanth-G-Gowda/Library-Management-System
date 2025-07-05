import React from 'react';

const ShowBookDetails = ({ book, onClose }) => {
  if (!book) return null;

  const { title, author, edition, image, status, location } = book;

  // Proper ordinal suffix logic
  const getOrdinal = (n) => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    const suffix = v >= 11 && v <= 13 ? 'th' : suffixes[n % 10] || 'th';
    return `${n}${suffix}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-2">
      <div className="bg-white w-full max-w-[90%] sm:max-w-sm md:max-w-md p-3 sm:p-4 rounded-lg shadow-lg">
        <div className="flex flex-col gap-4">
          {/* Top Section: Image + Title */}
          <div className="flex gap-3">
            <img
              src={image}
              alt={title}
              className="w-24 h-36 sm:w-24 sm:h-36 object-cover rounded-md border shadow-sm"
            />

            <div className="flex-1 flex items-center">
              <h2 className="text-base sm:text-xl font-semibold text-gray-800 leading-snug break-words line-clamp-3">
                {title}
              </h2>
            </div>
          </div>

          {/* Author and Edition */}
          <div className="pl-1 text-xs sm:text-sm text-gray-700 space-y-1">
            <p><strong>Author:</strong> {author}</p>
            <p><strong>Edition:</strong> {getOrdinal(Number(edition))}</p>
          </div>

          {/* Bottom Row: Status / Request + Close */}
          <div className="mt-1 flex items-center justify-between">
            {status === 'available' ? (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                Available
              </span>
            ) : (
              <span
                className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs sm:text-sm font-medium cursor-pointer hover:bg-blue-200 transition"
                onClick={() => alert('Book Request Sent!')}
              >
                Request for Book
              </span>
            )}

            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-xs sm:text-sm font-medium transition"
            >
              Close
            </button>
          </div>

          {/* Show Location Note Only if Available */}
          {status === 'available' && location?.shelf && location?.row && (
            <p className="mt-1 text-[11px] sm:text-xs text-left pl-1 text-gray-500 italic">
              Note: You can find this book on <strong>shelf {location.shelf}</strong>, row <strong>{location.row}</strong>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowBookDetails;