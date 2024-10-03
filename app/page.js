'use client';

import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterDialog from '../components/RegisterDialog';

export default function Home() {
  const [msg, setMsg] = useState('');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const openRegisterDialog = (e) => {
    e.preventDefault();
    setIsRegisterOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-400 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-center mb-8 text-white font-pacifico text-5xl drop-shadow-lg">
          RecipeShare
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <LoginForm setMsg={setMsg} />
        </div>
        {msg && <p className="text-center mt-4 text-white">{msg}</p>}
        <div className="text-center mt-4">
          <a
            href="#"
            onClick={openRegisterDialog}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            New user? Register here
          </a>
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