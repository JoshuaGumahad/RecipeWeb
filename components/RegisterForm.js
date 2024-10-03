'use client';

import { useState } from 'react';
import { FaUser, FaLock, FaCamera } from 'react-icons/fa';

export default function RegisterForm({ onSubmit }) {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ fullName, username, password, confirmPassword, profileImage });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full pl-10 pr-3 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
          required
        />
      </div>
      <div className="relative">
        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full pl-10 pr-3 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
          required
        />
      </div>
      <div className="relative">
        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full pl-10 pr-3 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
          required
        />
      </div>
      <div className="relative">
        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full pl-10 pr-3 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
          required
        />
      </div>
      <div className="flex justify-center">
        <label className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300">
          <FaCamera className="text-gray-500 text-2xl" />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>
      {profileImage && (
        <p className="text-sm text-gray-600 text-center">
          Image selected: {profileImage.name}
        </p>
      )}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-red-400 text-white rounded-full hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
      >
        Register
      </button>
    </form>
  );
}