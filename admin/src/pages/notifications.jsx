import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Notifications = () => {
  const [message, setMessage] = useState('');
  const [departments, setDepartments] = useState([]);
  const allDepartments = ['Computer Science', 'Electrical', 'Mechanical'];

  const toggleDept = (dept) => {
    setDepartments(prev =>
      prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]
    );
  };

  const sendNotification = () => {
    if (!message) {
      toast.error('Message is required');
      return;
    }

    toast.success(`Notification sent to ${departments.length ? departments.join(', ') : 'all departments'}`);
    setMessage('');
    setDepartments([]);
    // Send to backend here
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
