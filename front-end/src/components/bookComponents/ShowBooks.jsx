import React from 'react';

const ShowBooks = ({ book, onClick }) => {
  const { title, author, edition, status, image } = book;

  const getOrdinal = (n) => {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    const suffix =
      v >= 11 && v <= 13 ? 'th' : suffixes[n % 10] || 'th';
    return `${n}${suffix}`;
  };

  return (
    <div
      className="cursor-pointer w-[150px] sm:w-[180px] flex-shrink-0 bg-white rounded-xl shadow-sm p-2 flex flex-col justify-between h-[220px] sm:h-[240px]"
      onClick={() => onClick(book)}
    >
      <div>
        <div className="w-full h-[95px] sm:h-[110px] border border-gray-300 rounded-md overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
        <p className="mt-[6px] text-[11px] sm:text-sm font-medium text-gray-800 leading-snug line-clamp-2">
          {title}
        </p>
        <p className="text-[10px] sm:text-xs text-gray-500 truncate">{author}</p>
        <p className="text-[10px] sm:text-xs text-gray-500">{getOrdinal(Number(edition))} Edition</p>
      </div>
      <p
        className={`text-[10px] sm:text-xs font-semibold text-center mt-2 px-2 py-[2px] rounded-full border 
        ${
          status === 'available'
            ? 'text-green-600 border-green-500 bg-green-50'
            : 'text-red-600 border-red-500 bg-red-50'
        }`}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </p>
    </div>
  );
};

export default ShowBooks;