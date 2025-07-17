import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const backendURL = import.meta.env.VITE_BACKEND_URL;
        const token = localStorage.getItem('token');
        const res = await axios.get(`${backendURL}/api/book-requests`, {
          headers: { token }
        });
        if (res.data.success) {
          setRequests(res.data.requests);
        } else {
          setError('Failed to fetch book requests');
        }
      } catch (err) {
        let message = 'Failed to fetch book requests';
        if (err.response && err.response.data && err.response.data.message) {
          message += ': ' + err.response.data.message;
        } else if (err.message) {
          message += ': ' + err.message;
        }
        setError(message);
        console.error('Book Requests Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Book Requests</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : requests.length === 0 ? (
        <p>No book requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-r">Image</th>
                <th className="py-2 px-4 border-b border-r">Title</th>
                <th className="py-2 px-4 border-b border-r">Author</th>
                <th className="py-2 px-4 border-b border-r">Branch</th>
                <th className="py-2 px-4 border-b">Requests</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id}>
                  <td className="py-2 px-4 border-b border-r text-center">
                    {req.image ? (
                      <img src={req.image} alt={req.title} className="w-14 h-20 object-cover rounded mx-auto" />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b border-r">{req.title}</td>
                  <td className="py-2 px-4 border-b border-r">{req.author}</td>
                  <td className="py-2 px-4 border-b border-r">{Array.isArray(req.branch) ? req.branch.join(', ') : req.branch}</td>
                  <td className="py-2 px-4 border-b text-center">{req.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookRequests; 
