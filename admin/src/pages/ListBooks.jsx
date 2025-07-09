import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import DeleteConfirmation from '../component/DeleteConfirmation';
import EditBook from '../component/EditBook'; // 👈 New import

const getOrdinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
};

const ListBooks = ({ token }) => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [editingBook, setEditingBook] = useState(null); // 👈 For edit modal

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/books/allBooks`, {
        headers: { token }
      });
      if (res.data.success) {
        setBooks(res.data.books);
      } else {
        toast.error("Failed to load books");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching books");
    }
  };

  const confirmDelete = async ({ all, bookNumbers }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/books/deleteSelected`,
        {
          id: selectedBook._id,
          all,
          bookNumbers,
        },
        {
          headers: {
            token,
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        fetchBooks();
        setSelectedBook(null);
      } else {
        toast.error("Failed to delete book");
      }
    } catch (err) {
      console.error("ConfirmDelete Error:", err.response?.data || err.message);
      toast.error("Error deleting book");
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.isbn?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    const handleBookAdded = () => fetchBooks();
    window.addEventListener('bookAdded', handleBookAdded);
    return () => window.removeEventListener('bookAdded', handleBookAdded);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">📖 Book List</h2>
        <button
          onClick={fetchBooks}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm flex items-center gap-2"
        >
          🔄 Refresh
        </button>
      </div>

      <input
        type="text"
        placeholder="🔍 Search by title, author, or ISBN..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 rounded w-full mb-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-200 rounded shadow">
          <thead className="bg-blue-50">
            <tr>
              <th className="p-3 border">Image</th>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Author</th>
              <th className="p-3 border">Edition</th>
              <th className="p-3 border">ISBN</th>
              <th className="p-3 border text-center">Total Books</th>
              <th className="p-3 border text-center">Available Books</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.length > 0 ? (
              filteredBooks.map(book => (
                <tr key={book._id} className="hover:bg-gray-50">
                  <td className="p-3 border">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-14 h-20 object-cover rounded"
                    />
                  </td>
                  <td className="p-3 border font-medium">{book.title}</td>
                  <td className="p-3 border">{book.author}</td>
                  <td className="p-3 border">{getOrdinal(book.edition)}</td>
                  <td className="p-3 border font-mono text-xs">{book.isbn}</td>
                  <td className="p-3 border text-center font-semibold">{book.bookNumbers?.length ?? 0}</td>
                  <td className="p-3 border text-center font-semibold text-green-600">{book.availableBookNumbers?.length ?? 0}</td>
                  <td className="p-3 border text-center">
                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => setEditingBook(book)}
                        className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-sm w-20"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => setSelectedBook(book)}
                        className="px-1 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm w-20"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  No books found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedBook && (
        <DeleteConfirmation
          book={selectedBook}
          onCancel={() => setSelectedBook(null)}
          onConfirm={confirmDelete}
        />
      )}

      {editingBook && (
        <EditBook
          book={editingBook}
          token={token}
          onClose={() => setEditingBook(null)}
          onSuccess={fetchBooks}
        />
      )}
    </div>
  );
};

export default ListBooks;