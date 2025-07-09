import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const EditBook = ({ book, onClose, token, onSuccess }) => {
  const [form, setForm] = useState({
    title: '',
    author: '',
    edition: '',
    isbn: '',
    publisher: '',
    year: '',
    shelf: '',
    row: '',
    imageFile: null,
    imageUrl: '',
  });

  useEffect(() => {
    if (book) {
      setForm({
        title: book.title || '',
        author: book.author || '',
        edition: book.edition || '',
        isbn: book.isbn || '',
        publisher: book.publisher || '',
        year: book.year || '',
        shelf: book.shelf || '',
        row: book.row || '',
        imageFile: null,
        imageUrl: book.image || '',
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, imageFile: e.target.files[0], imageUrl: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      // Append all non-empty fields except file
      Object.entries(form).forEach(([key, val]) => {
        if (key !== 'imageFile' && val !== '') {
          formData.append(key, val);
        }
      });

      if (form.imageFile) {
        formData.append('image', form.imageFile);
      }

      // Ensure edition and year are numbers
      if (form.edition) formData.set('edition', Number(form.edition));
      if (form.year) formData.set('year', Number(form.year));

      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/books/edit/${book.isbn}`,
        formData,
        {
          headers: {
            token,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (res.data.success) {
        toast.success('📘 Book updated successfully');
        onSuccess(); // refresh list
        onClose(); // close modal
      } else {
        toast.error(res.data.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error while updating book');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-lg relative">
        {/* ❌ Close button */}
        <button onClick={onClose} className="absolute top-3 right-4 text-2xl text-gray-600 hover:text-red-500">×</button>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">✏️ Edit Book</h2>

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          {/* 📷 Image Inputs */}
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="block text-gray-600 mb-1">Upload New Image</label>
              <input type="file" onChange={handleFileChange} className="w-full text-sm border rounded p-1" />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-600 mb-1">Or paste image URL</label>
              <input
                type="text"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* 🔤 Title & Author */}
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="author"
            value={form.author}
            onChange={handleChange}
            placeholder="Author"
            className="w-full p-2 border rounded"
            required
          />

          {/* 🧾 Edition & ISBN */}
          <div className="flex gap-2">
            <input
              type="number"
              name="edition"
              value={form.edition}
              onChange={handleChange}
              placeholder="Edition"
              className="w-1/2 p-2 border rounded"
            />
            <input
              type="text"
              name="isbn"
              value={form.isbn}
              disabled
              className="w-1/2 p-2 border rounded bg-gray-100 text-gray-500"
            />
          </div>

          {/* 🏢 Publisher & Year */}
          <input
            type="text"
            name="publisher"
            value={form.publisher}
            onChange={handleChange}
            placeholder="Publisher"
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            name="year"
            value={form.year}
            onChange={handleChange}
            placeholder="Published Year"
            className="w-full p-2 border rounded"
          />

          {/* 🗄 Shelf & Row */}
          <div className="flex gap-2">
            <input
              type="text"
              name="shelf"
              value={form.shelf}
              onChange={handleChange}
              placeholder="Shelf"
              className="w-1/2 p-2 border rounded"
            />
            <input
              type="text"
              name="row"
              value={form.row}
              onChange={handleChange}
              placeholder="Row"
              className="w-1/2 p-2 border rounded"
            />
          </div>

          {/* ✅ Save */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            ✅ Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBook;