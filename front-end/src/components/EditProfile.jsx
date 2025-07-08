import React from 'react';

const departments = [
  'Computer Science and Engineering',
  'Electronics and Communication Engineering',
  'Electrical and Electronics Engineering',
  'Information Science and Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Artificial Intelligence and Machine Learning',
  'Data Science',
  'Aerospace Engineering',
  'Chemical Engineering',
  'Bio-Technology',
  'Medical Electronics',
  'Industrial Engineering and Management',
  'Robotics and Automation',
  'Instrumentation Technology',
  'Environmental Engineering',
  'Automobile Engineering',
];

const semesters = Array.from({ length: 8 }, (_, i) => `${i + 1}`);

const EditProfile = ({ editForm, setEditForm, onSave, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-gray-300 shadow-xl rounded-lg p-6 w-[90%] max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit Profile</h2>

        <div className="space-y-4">
          {/* Editable fields */}
          {['name', 'phone', 'email'].map((field) => (
            <div key={field} className="flex flex-col">
              <label htmlFor={field} className="text-sm font-medium capitalize text-gray-700">
                {field}
              </label>
              <input
                id={field}
                type={field === 'email' ? 'email' : 'text'}
                value={editForm[field]}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, [field]: e.target.value }))
                }
                className="px-3 py-2 mt-1 rounded-md border border-gray-400 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          {/* Branch Dropdown */}
          <div className="flex flex-col">
            <label htmlFor="branch" className="text-sm font-medium text-gray-700">
              Branch
            </label>
            <input
              list="branch-options"
              id="branch"
              value={editForm.branch}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, branch: e.target.value }))
              }
              className="px-3 py-2 mt-1 rounded-md border border-gray-400 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search or select branch"
            />
            <datalist id="branch-options">
              {departments.map((dept, index) => (
                <option key={index} value={dept} />
              ))}
            </datalist>
          </div>

          {/* Semester Dropdown */}
          <div className="flex flex-col">
            <label htmlFor="sem" className="text-sm font-medium text-gray-700">
              Semester
            </label>
            <input
              list="sem-options"
              id="sem"
              value={editForm.sem}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, sem: e.target.value }))
              }
              className="px-3 py-2 mt-1 rounded-md border border-gray-400 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Select semester (1-8)"
            />
            <datalist id="sem-options">
              {semesters.map((s, index) => (
                <option key={index} value={s} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6">
          <button
            className="px-4 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            onClick={onSave}
          >
            Save
          </button>
          <button
            className="px-4 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
