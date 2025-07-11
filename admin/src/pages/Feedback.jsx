import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FILTERS = [
  { label: 'Last Week', value: 'week' },
  { label: 'Last Month', value: 'month' },
  { label: 'Last 3 Months', value: '3months' },
  { label: 'Last Year', value: 'year' },
  { label: 'All', value: 'all' },
];

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('week');

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      setError('');
      try {
        const backendURL = import.meta.env.VITE_BACKEND_URL;
        const res = await axios.get(`${backendURL}/api/feedback?range=${filter}`);
        if (res.data.success) {
          setFeedbacks(res.data.feedbacks);
        } else {
          setError('Failed to fetch feedback');
        }
      } catch (err) {
        setError('Failed to fetch feedback');
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, [filter]);

  // Helper to format date as dd-mm-yyyy
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Feedback</h2>
      <div className="mb-4 flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f.value}
            className={`px-3 py-1 rounded border ${filter === f.value ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-gray-300'} transition`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : feedbacks.length === 0 ? (
        <p>No feedback found for this period.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-r">Date</th>
                <th className="py-2 px-4 border-b border-r">User</th>
                <th className="py-2 px-4 border-b">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map(fb => (
                <tr key={fb._id}>
                  <td className="py-2 px-4 border-b border-r text-xs">{formatDate(fb.createdAt)}</td>
                  <td className="py-2 px-4 border-b border-r text-xs">
                    {fb.user?.name || 'Anonymous'}<br/>
                    {fb.user?.srn && <span className="text-gray-400">{fb.user.srn}</span>}
                  </td>
                  <td className="py-2 px-4 border-b text-sm">{fb.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Feedback;
