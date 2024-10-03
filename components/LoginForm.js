'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaLock } from 'react-icons/fa';

export default function LoginForm({ setMsg }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost/recipewebv3/api/aut.php?operation=login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          operation: 'login',
          username: username,
          password: password
        })
      });

      const data = await response.json();

      if (data.length > 0 && data[0].user_id) {
        // Successful login
        router.push(`/home?userId=${data[0].user_id}`);
      } else {
        // Failed login
        setMsg('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMsg('An error occurred during login');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FF6B6B]" />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#FF6B6B]"
        />
      </div>
      <div className="relative">
        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FF6B6B]" />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#FF6B6B]"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-[#FF6B6B] text-white py-2 rounded-lg hover:bg-[#FF5252] transition duration-300"
      >
        Login
      </button>
    </form>
  );
}