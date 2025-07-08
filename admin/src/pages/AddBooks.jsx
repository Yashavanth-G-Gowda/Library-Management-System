import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import AddBookConfirmation from '../component/AddBookConfirmation';

const branchesList = [
  { code: 'cse', name: 'Computer Science and Engineering' },
  { code: 'ece', name: 'Electronics and Communication Engineering' },
  { code: 'ise', name: 'Information Science and Engineering' },
  { code: 'bt', name: 'Biotechnology' },
  { code: 'ctm', name: 'Construction Technology and Management' },
  { code: 'cv', name: 'Civil Engineering' },
  { code: 'ev', name: 'Environmental Engineering' },
  { code: 'ip', name: 'Industrial and Production Engineering' },
  { code: 'me', name: 'Mechanical Engineering' },
  { code: 'pst', name: 'Polymer Science and Technology' },
  { code: 'eee', name: 'Electrical and Electronic Engineering' },
  { code: 'eie', name: 'Electronics and Instrumentation Engineering' },
  { code: 'csbs', name: 'Computer Science and Business Systems' },
  { code: 'ca', name: 'Computer Application' },
  { code: 'chm', name: 'Chemistry' },
  { code: 'maths', name: 'Mathematics' },
  { code: 'phy', name: 'Physics' }
];

const AddBooks = ({ token }) => {
  const defaultForm = {
    title: '',
    edition: '',
    author: '',
    isbn: '',
    bookNumbers: [''],
    publisher: '',
    year: '',
    shelf: '',
    row: '',
    tags: [''],
    branches: [],
    imageFile: null,
    imageURL: ''
  };

  const [formData, setFormData] = useState(defaultForm);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [duplicateBook, setDuplicateBook] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageFile') {
      setFormData({ ...formData, imageFile: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDynamicChange = (field, index, value) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const addDynamicField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeDynamicField = (field, index) => {
    const updated = [...formData[field]];
    if (updated.length > 1) {
      updated.splice(index, 1);
      setFormData({ ...formData, [field]: updated });
    }
  };

  const toggleBranch = (code) => {
    const updated = formData.branches.includes(code)
      ? formData.branches.filter((b) => b !== code)
      : [...formData.branches, code];
    setFormData({ ...formData, branches: updated });
  };

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    // Manual required field validation
    const isValid =
      formData.title &&
      formData.edition &&
      formData.author &&
      formData.isbn &&
      formData.publisher &&
      formData.year &&
      formData.shelf &&
      formData.row &&
      formData.bookNumbers.every((num) => num.trim() !== '') &&
      formData.tags.every((tag) => tag.trim() !== '') &&
      formData.branches.length > 0 &&
      (formData.imageFile || formData.imageURL);

    if (!isValid) {
      toast.error("⚠️ Please fill all required fields including image, branches, book numbers, and tags.");
      setSubmitting(false);
      return;
    }

    const payload = new FormData();
    for (const key in formData) {
      if (Array.isArray(formData[key])) {
        payload.append(key, JSON.stringify(formData[key]));
      } else if (key === 'imageFile' && formData.imageFile) {
        payload.append('image', formData.imageFile);
      } else {
        payload.append(key, formData[key]);
      }
    }
    payload.append('location', JSON.stringify({ shelf: formData.shelf, row: formData.row }));
    payload.append('confirmed', confirmed);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/books/addBooks`,
        payload,
        { headers: { token, 'Content-Type': 'multipart/form-data' } }
      );

      if (res.data.duplicate && !confirmed) {
        setDuplicateBook(res.data.book);
        setShowConfirmModal(true);
        setSubmitting(false);
        return;
      }

      if (res.data.success) {
        toast.success(res.data.message || "Book added successfully!");
        setFormData(defaultForm);
        setConfirmed(false);
        setDuplicateBook(null);
      } else {
        toast.error(res.data.message || "Failed to add book.");
      }
    } catch (err) {
      console.error("Submit Error:", err);
      toast.error("Error while adding book.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (confirmed) {
      handleSubmit();
    }
  }, [confirmed]);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-md mt-4">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">➕ Add a New Book</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <Input label="Title" name="title" value={formData.title} onChange={handleChange} required />
          <Input label="Edition" name="edition" type="number" value={formData.edition} onChange={handleChange} required />
          <Input label="Author" name="author" value={formData.author} onChange={handleChange} required />
          <Input label="ISBN" name="isbn" value={formData.isbn} onChange={handleChange} required />
          <Input label="Publisher" name="publisher" value={formData.publisher} onChange={handleChange} required />
          <Input label="Year" name="year" type="number" value={formData.year} onChange={handleChange} required />
          <Input label="Shelf" name="shelf" value={formData.shelf} onChange={handleChange} required />
          <Input label="Row" name="row" value={formData.row} onChange={handleChange} required />
        </div>

        <DynamicField label="Book Numbers" field="bookNumbers" values={formData.bookNumbers} onChange={handleDynamicChange} onAdd={addDynamicField} onRemove={removeDynamicField} required />
        <DynamicField label="Tags" field="tags" values={formData.tags} onChange={handleDynamicChange} onAdd={addDynamicField} onRemove={removeDynamicField} required />

        <div>
          <label className="block font-medium text-sm text-gray-700 mb-1">Select Branches <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-600">
            {branchesList.map(branch => (
              <label key={branch.code} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.branches.includes(branch.code)}
                  onChange={() => toggleBranch(branch.code)}
                  className="accent-blue-600"
                />
                {branch.name}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 font-medium text-sm text-gray-700">Upload Book Image <span className="text-red-500">*</span></p>
          <div className="flex items-center gap-4">
            <label htmlFor="imageFile">
              <img
                className="w-20 h-20 object-cover border rounded-md cursor-pointer"
                src={
                  formData.imageFile
                    ? URL.createObjectURL(formData.imageFile)
                    : assets.upload_area
                }
                alt="Upload"
              />
              <input
                type="file"
                id="imageFile"
                name="imageFile"
                accept="image/*"
                hidden
                onChange={(e) => setFormData({ ...formData, imageFile: e.target.files[0] })}
              />
            </label>
          </div>
        </div>

        <Input label="Or provide image URL" name="imageURL" value={formData.imageURL} onChange={handleChange} />

        <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 text-sm">
          Add Book
        </button>
      </form>

      {showConfirmModal && (
        <AddBookConfirmation
          existingBook={duplicateBook}
          onCancel={() => {
            setShowConfirmModal(false);
            setConfirmed(false);
          }}
          onConfirm={() => {
            setShowConfirmModal(false);
            setConfirmed(true); // triggers resubmission
          }}
        />
      )}
    </div>
  );
};

const Input = ({ label, name, value, onChange, type = "text", required }) => (
  <div className="flex flex-col text-sm">
    <label className="font-medium mb-1 text-gray-700">{label} {required && <span className="text-red-500">*</span>}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
    />
  </div>
);

const DynamicField = ({ label, field, values, onChange, onAdd, onRemove, required }) => {
  const inputRefs = useRef([]);
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, values.length);
  }, [values]);

  const handleAdd = () => {
    onAdd(field);
    setTimeout(() => {
      const index = values.length;
      inputRefs.current[index]?.focus();
    }, 0);
  };

  return (
    <div className="mb-4">
      <label className="block font-medium mb-1 text-gray-700">{label} {required && <span className="text-red-500">*</span>}</label>
      <div className="flex flex-wrap gap-2">
        {values.map((val, i) => (
          <div key={i} className="relative w-32">
            <input
              required={required}
              ref={(el) => inputRefs.current[i] = el}
              type="text"
              value={val}
              onChange={(e) => onChange(field, i, e.target.value)}
              className="border border-gray-300 p-1 pr-6 pl-2 rounded-md text-sm w-full"
            />
            <button
              type="button"
              onClick={() => onRemove(field, i)}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700"
              title="Remove"
            >
              🗑
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className="mt-2 text-blue-600 text-sm hover:underline"
      >
        + Add More
      </button>
    </div>
  );
};

export default AddBooks;