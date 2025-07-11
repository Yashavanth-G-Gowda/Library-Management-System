import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const mockRequests = [
  {
    id: 1,
    department: 'Computer Science',
    action: 'add',
    book: { title: 'React Basics', author: 'John Doe', isbn: '123456' }
  },
  {
    id: 2,
    department: 'Electrical',
    action: 'remove',
    book: { title: 'Circuit Analysis', author: 'Jane Smith', isbn: '789012' }
  }
];

const DepartmentRequest = ({ token }) => {
  const [requests, setRequests] = useState([]);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    // Replace this with API call
    setRequests(mockRequests);
  }, []);

  const handleConfirm = (req) => {
    setConfirmAction(req);
  };

  const handleAction = () => {
    const { id, action, book } = confirmAction;
    toast.success(`${action === 'add' ? 'Added' : 'Removed'} book: ${book.title}`);
    setRequests(requests.filter(r => r.id !== id));
    setConfirmAction(null);
    // You would normally send a POST/DELETE to backend here
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Department Book Requests</h2>
      <ul className="space-y-4">
        {requests.map(req => (
          <li key={req.id} className="p-4 border rounded shadow bg-white">
            <div className="mb-2">
              <strong>Department:</strong> {req.department}
            </div>
            <div><strong>Book Title:</strong> {req.book.title}</div>
            <div><strong>Author:</strong> {req.book.author}</div>
            <div><strong>ISBN:</strong> {req.book.isbn}</div>
            <button
              onClick={() => handleConfirm(req)}
              className={`mt-3 px-4 py-2 rounded text-white ${req.action === 'add' ? 'bg-green-600' : 'bg-red-600'}`}
            >
              {req.action === 'add' ? 'Approve Add' : 'Remove Book'}
            </button>
          </li>
        ))}
      </ul>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded shadow-lg text-center w-96">
            <p className="mb-4">
              Are you sure you want to {confirmAction.action} the book <strong>{confirmAction.book.title}</strong>?
            </p>
            <div className="space-x-4">
              <button
                onClick={handleAction}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Yes, Confirm
              </button>
              <button
                onClick={() => setConfirmAction(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentRequest;
