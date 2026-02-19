'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/admin');
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={handleLogin} className="p-8 border border-white/10 rounded-xl bg-white/5 space-y-4 w-96">
        <h1 className="text-xl font-bold mb-4">Admin Login</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Admin Secret"
          className="w-full p-2 bg-black border border-white/20 rounded focus:border-blue-500 outline-none"
        />
        <button type="submit" className="w-full bg-blue-600 p-2 rounded hover:bg-blue-500">
          Login
        </button>
      </form>
    </div>
  );
}
