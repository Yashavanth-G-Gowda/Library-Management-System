import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';

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
    e.preventDefault();

    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('edition', formData.edition);
    payload.append('author', formData.author);
    payload.append('bookNumbers', JSON.stringify(formData.bookNumbers));
    payload.append('publisher', formData.publisher);
    payload.append('year', formData.year);
    payload.append('location', JSON.stringify({ shelf: formData.shelf, row: formData.row }));
    payload.append('tags', JSON.stringify(formData.tags));
    payload.append('branch', JSON.stringify(formData.branches));

    if (formData.imageFile) {
      payload.append('image', formData.imageFile);
    } else if (formData.imageURL) {
      payload.append('imageURL', formData.imageURL);
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/books/addBooks`,
        payload,
        { headers: { token, 'Content-Type': 'multipart/form-data' } }
      );
      toast.success(res.data.message || "Book added successfully!");
      setFormData(defaultForm);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong while adding book.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-md mt-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">➕ Add a New Book</h2>
      <form onSubmit={handleSubmit} className="space-y-5">

        <div className="grid md:grid-cols-2 gap-4">
          <Input label="Title" name="title" value={formData.title} onChange={handleChange} />
          <Input label="Edition" name="edition" type="number" value={formData.edition} onChange={handleChange} />
          <Input label="Author" name="author" value={formData.author} onChange={handleChange} />
          <Input label="Publisher" name="publisher" value={formData.publisher} onChange={handleChange} />
          <Input label="Year" name="year" type="number" value={formData.year} onChange={handleChange} />
          <Input label="Shelf" name="shelf" value={formData.shelf} onChange={handleChange} />
          <Input label="Row" name="row" value={formData.row} onChange={handleChange} />
        </div>

        <DynamicField
          label="Book Numbers"
          field="bookNumbers"
          values={formData.bookNumbers}
          onChange={handleDynamicChange}
          onAdd={addDynamicField}
          onRemove={removeDynamicField}
        />

        <DynamicField
          label="Tags"
          field="tags"
          values={formData.tags}
          onChange={handleDynamicChange}
          onAdd={addDynamicField}
          onRemove={removeDynamicField}
        />

        {/* Branch Checkboxes */}
        <div>
          <label className="block font-medium text-sm text-gray-700 mb-1">Select Branches</label>
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

        {/* Image Upload */}
        <div>
          <p className="mb-2 font-medium text-sm text-gray-700">Upload Book Image</p>
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
                onChange={(e) =>
                  setFormData({ ...formData, imageFile: e.target.files[0] })
                }
              />
            </label>
          </div>
        </div>

        <Input label="Or provide image URL" name="imageURL" value={formData.imageURL} onChange={handleChange} />

        <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 text-sm">
          Add Book
        </button>
      </form>
    </div>
  );
};

const Input = ({ label, name, value, onChange, type = "text" }) => (
  <div className="flex flex-col text-sm">
    <label className="font-medium mb-1 text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
    />
  </div>
);

const DynamicField = ({ label, field, values, onChange, onAdd, onRemove }) => {
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
      <label className="block font-medium mb-1 text-gray-700">{label}</label>
      <div className="flex flex-wrap gap-2">
        {values.map((val, i) => (
          <div key={i} className="relative w-32">
            <input
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