import React, { useRef, useState, useContext, useEffect } from 'react';
import { FaEdit, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserContext } from '../context/UserContext';
import { assets } from '../assets/assets';
import EditProfile from '../components/EditProfile';

const backendURL = import.meta.env.VITE_BACKEND_URL;

const MyProfile = () => {
  const fileInputRef = useRef(null);
  const {token, userInfo, setUserInfo } = useContext(UserContext);
  const [profileImage, setProfileImage] = useState(assets.profile_icon);
  const [showMore, setShowMore] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    branch: '',
    sem: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    if (userInfo?.image) setProfileImage(userInfo.image);
    if (userInfo) {
      setEditForm({
        name: userInfo.name || '',
        branch: userInfo.branch || '',
        sem: userInfo.sem || '',
        phone: userInfo.phone || '',
        email: userInfo.email || ''
      });
    }
  }, [userInfo]);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfileImage(imageURL);
      // TODO: Upload image to backend/cloud
    }
  };

  const handleSave = () => {
    axios
      .put(`${backendURL}/api/user/userUpdate`, editForm, {headers: {token}})
      .then((res) => {
        if (res.data.success) {
          toast.success("Profile updated successfully");
          setUserInfo(res.data.user); // update frontend context
          setIsEditing(false);
        } else {
          toast.error(res.data.message || "Failed to update");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Something went wrong");
      });
  };

  return (
    <div className="p-4 rounded-xl max-w-md mx-auto">
      {/* Profile Image + Name */}
      <div className="flex items-center pl-4 space-x-4">
        <div
          onClick={handleImageClick}
          className="w-20 h-20 rounded-full overflow-hidden border cursor-pointer"
        >
          <img
            src={profileImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <div className="pl-4 flex flex-col text-left">
          <h2 className="text-lg mb-1 font-bold">{userInfo?.name || 'Demo User'}</h2>
          <p className="text-sm font-semibold text-gray-600">{userInfo?.srn || 'SRN1234'}</p>
        </div>
      </div>

      {/* Buttons: Edit + More */}
      <div className="mt-4 flex justify-between items-center">
        <button
          className="flex items-center ml-6 gap-1 px-5 py-1 font-medium text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>

        <button
          onClick={() => setShowMore(!showMore)}
          className="flex items-center gap-1 px-2 mr-20 py-1 text-sm text-gray-700 underline"
        >
          {showMore ? 'Less' : 'More'}
          {showMore ? <FaChevronUp className="pt-1" /> : <FaChevronDown className="pt-1" />}
        </button>
      </div>

      {/* Additional Info */}
      {showMore && (
        <div className="mt-6 text-sm font-medium ml-7 space-y-2">
          <p><strong>Branch:</strong> {userInfo?.branch || 'Branch'}</p>
          <p><strong>Semester:</strong> {userInfo?.sem || 'Semester'}</p>
          <p><strong>Phone:</strong> {userInfo?.phone || 'Phone number'}</p>
          <p><strong>Email:</strong> {userInfo?.email || 'email@example.com'}</p>
        </div>
      )}

      <hr className="mt-6 mx-3 border-t-2 border-gray-300" />

      {/* Placeholder for Recent Books */}
      <div className="mt-6">{/* Future content */}</div>

      {/* Edit Modal */}
      {isEditing && (
        <EditProfile
          editForm={editForm}
          setEditForm={setEditForm}
          onSave={handleSave}
          onCancel={() => {
            setEditForm({
              name: userInfo.name || '',
              branch: userInfo.branch || '',
              sem: userInfo.sem || '',
              phone: userInfo.phone || '',
              email: userInfo.email || ''
            });
            setIsEditing(false);
          }}
        />
      )}
    </div>
  );
};

export default MyProfile;