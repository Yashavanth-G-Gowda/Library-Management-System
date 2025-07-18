import React, { useEffect, useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { assets } from '../assets/assets';
import ShowBooks from '../components/bookComponents/ShowBooks';

const Search = () => {
  const { setShowNavbar, navigate, books } = useContext(UserContext);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    setShowNavbar(false);
    return () => setShowNavbar(true);
  }, [setShowNavbar]);

  useEffect(() => {
    if (query.trim().length >= 3) {
      const q = query.toLowerCase();
      const filtered = books.filter((book) =>
        (book.title && book.title.toLowerCase().includes(q)) ||
        (book.author && book.author.toLowerCase().includes(q)) ||
        (book.isbn && book.isbn.toLowerCase().includes(q))
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query, books]);

  return (
    <div className="min-h-screen px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <img onClick={() => navigate(-1)} src={assets.back} alt="back" className="w-5 h-5" />
          <span className="text-lg">Search Books</span>
        </div>
        <img src={assets.mic} alt="mic" className="w-5 h-5" />
      </div>
      <hr />

      {/* Search Controls */}
      <div className="flex flex-col sm:flex-row gap-2 items-center mt-6 mb-6">
        <input
          type="text"
          placeholder="Search by title, author, or ISBN"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Results */}
      {query.trim().length >= 3 && (
        <div>
          {results.length === 0 ? (
            <p className="text-gray-500">No books found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-2 sm:px-4">
              {results.map((book) => (
                <ShowBooks key={book._id} book={book} onClick={() => navigate(`/book/${book._id}`)} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;