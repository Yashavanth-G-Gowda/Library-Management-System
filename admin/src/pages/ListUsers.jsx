import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserInformation from '../component/UserInformation';

const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // Fetch all users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backendURL}/api/user/allusers`, {
          headers: { token }
        });
        setUsers(response.data.users || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [backendURL]);

  // Safe search filter with optional chaining
  const filteredUsers = [...users]
  .sort((a, b) => (a.srn || '').localeCompare(b.srn || '')) // ✅ SRN sorting
  .filter(user =>
    (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.srn?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );


  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">User List</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name, SRN, or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border px-3 py-2 w-full mb-4 rounded shadow-sm text-sm"
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">SR Number</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center px-4 py-4 text-blue-500">
                  Loading users...
                </td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{user.srn || 'N/A'}</td>
                  <td className="px-4 py-2">{user.name || 'N/A'}</td>
                  <td className="px-4 py-2">{user.email || 'N/A'}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center px-4 py-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View user details */}
      {selectedUser && (
        <UserInformation user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
};

export default ListUsers;