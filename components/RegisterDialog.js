import { useState } from 'react';
import RegisterForm from './RegisterForm';

export default function RegisterDialog({ isOpen, onClose }) {
  const [msg, setMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-96 max-w-full">
        <h2 className="text-2xl font-pacifico text-center text-red-400 mb-6">Join RecipeShare</h2>
        <RegisterForm onSubmit={handleSubmit} setMsg={setMsg} />
        {msg && (
          <p className="mt-4 text-sm text-center text-gray-600">{msg}</p>
        )}
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}