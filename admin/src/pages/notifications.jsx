import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const Notifications = () => {
  const [message, setMessage] = useState('');
  const [departments, setDepartments] = useState([]);
  const allDepartments = [
    'Computer Science (cse)',
    'Electronics & Communication (ece)',
    'Electrical & Electronics (eee)',
    'Information Science (ise)',
    'Mechanical (me)',
    'Civil (cv)',
    'Industrial Production (ip)',
    'Biotechnology (bt)',
    'Chemical Engineering (che)',
    'Environmental (ev)',
    'Polymer Science (pst)',
    'Construction Technology & Management (ctm)',
    'Computer Applications (ca)',
    'Physics (phy)',
    'Mathematics (mat)',
    'Chemistry (chm)',
    'CSBS (csbs)',
    'Electronics & Instrumentation (eie)'
  ];

  const toggleDept = (dept) => {
    setDepartments(prev =>
      prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]
    );
  };

  const sendNotification = async () => {
    if (!message) {
      toast.error('Message is required');
      return;
    }
    try {
      const backendURL = import.meta.env.VITE_BACKEND_URL || '';
      const adminToken = localStorage.getItem('adminToken');
      
      if (!adminToken) {
        toast.error('Admin authentication required');
        return;
      }

      const res = await axios.post(`${backendURL}/api/user/admin/notify`, {
        message,
        departments
      }, {
        headers: {
          token: adminToken
        }
      });
      
      if (res.data.success) {
        toast.success(res.data.message || 'Notification sent!');
        setMessage('');
        setDepartments([]);
      } else {
        toast.error(res.data.message || 'Failed to send notification');
      }
    } catch (err) {
      console.error('Notification error:', err);
      if (err.response?.status === 401) {
        toast.error('Admin authentication failed');
      } else {
        toast.error('Failed to send notification');
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Send Notification</h2>
      <textarea
        className="w-full border p-2 mb-4"
        rows={4}
        value={message}
        placeholder="Enter message"
        onChange={(e) => setMessage(e.target.value)}
      />
      <div className="mb-4">
        <h4 className="font-medium mb-2">Select Departments (leave empty to send to all):</h4>
        <div className="flex flex-wrap gap-3">
          {allDepartments.map(dept => (
            <button
              key={dept}
              onClick={() => toggleDept(dept)}
              className={`px-3 py-1 rounded border ${departments.includes(dept) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={sendNotification}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Send Notification
      </button>
    </div>
  );
};

export default Notifications;
