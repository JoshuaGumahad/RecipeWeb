'use client';

import { useState } from 'react';
import Image from 'next/image';
import LoginForm from '../components/LoginForm';
import RegisterDialog from '../components/RegisterDialog';
import loginBg from '../assets/images/loginbg.jpeg';

export default function Home() {
  const [msg, setMsg] = useState('');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const openRegisterDialog = (e) => {
    e.preventDefault();
    setIsRegisterOpen(true);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <Image
        src={loginBg}
        alt="Background"
        fill
        style={{ objectFit: 'cover' }}
        quality={100}
        priority
      />
      <div className="w-full max-w-md z-10 text-center">
        <div className="mb-8">
          <div className="text-white text-6xl mb-4">🍽️</div>
          <h1 className="text-5xl font-cursive text-white mb-2 drop-shadow-lg">
            RecipeShare
          </h1>
          <p className="text-white text-lg font-light">
            Discover, Share, and Cook Together
          </p>
        </div>
        <div className="bg-white bg-opacity-80 rounded-lg shadow-md p-8">
          <LoginForm setMsg={setMsg} />
        </div>
        {msg && <p className="mt-4 text-white font-bold text-lg">{msg}</p>}
        <div className="mt-6">
          <button
            onClick={openRegisterDialog}
            className="text-white font-bold text-lg hover:underline cursor-pointer"
          >
            New to RecipeShare? Join our cooking community!
          </button>
        </div>
      </div>
      <RegisterDialog
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        setMsg={setMsg}
      />
    </div>
  );
}
