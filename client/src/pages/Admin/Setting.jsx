import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons
import Sidebar from '../../components/Layouts/SideNav'; // Assuming this is your sidebar component
import Header from '../../components/Layouts/SidebarHeader'; // Assuming this is your header component

const Setting = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' }); // { type: 'success' | 'error', text: 'Your message' }
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // Parse user data from localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' }); // Clear previous messages

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return setMessage({ type: 'error', text: 'All fields are required.' });
    }

    if (newPassword !== confirmNewPassword) {
      return setMessage({ type: 'error', text: "New passwords don't match." });
    }

    if (newPassword.length < 6) {
      return setMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
    }

    try {
      setLoading(true);

      const userId = user?._id || user?.id; // Using optional chaining for safety
      if (!userId) {
        return setMessage({ type: 'error', text: 'User ID not found. Please log in again.' });
      }

      const response = await axios.post(
        'https://meetix.mahitechnocrafts.in/user/api/v1/change-password',
        {
          userId,
          currentPassword,
          newPassword,
        }
      );

      setMessage({ type: 'success', text: response.data.message || 'Password changed successfully!' });
      // Clear form fields on success
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      console.log(error)
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Something went wrong. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} name="Account Settings" /> {/* Updated header title */}

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="container mx-auto max-w-lg bg-white rounded-lg shadow-lg p-8 mt-10">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">Your Profile & Password</h2>

            {/* User Details Section */}
            {user && (
              <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">User Information</h3>
                <div className="mb-3">
                  <p className="text-gray-600">
                    <span className="font-medium">Name:</span> {user.username || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span> {user.email || 'N/A'}
                  </p>
                </div>
              </div>
            )}

            <h3 className="text-xl font-semibold text-gray-700 mb-4">Change Password</h3>

            {message.text && (
              <div
                className={`p-3 mb-4 rounded-md text-sm ${
                  message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleChangePassword}>
              <div className="mb-5 relative">
                <label htmlFor="currentPassword" className="block text-gray-700 text-sm font-semibold mb-2">
                  Current Password
                </label>
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  id="currentPassword"
                  className="shadow-sm appearance-none border rounded w-full py-3 px-4 pr-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 mt-7"
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="mb-5 relative">
                <label htmlFor="newPassword" className="block text-gray-700 text-sm font-semibold mb-2">
                  New Password
                </label>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  className="shadow-sm appearance-none border rounded w-full py-3 px-4 pr-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 mt-7"
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="mb-6 relative">
                <label htmlFor="confirmNewPassword" className="block text-gray-700 text-sm font-semibold mb-2">
                  Confirm New Password
                </label>
                <input
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  id="confirmNewPassword"
                  className="shadow-sm appearance-none border rounded w-full py-3 px-4 pr-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 mt-7"
                >
                  {showConfirmNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-md text-white font-semibold transition duration-300 ease-in-out ${
                  loading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
                }`}
              >
                {loading ? 'Changing Password...' : 'Change Password'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Setting;