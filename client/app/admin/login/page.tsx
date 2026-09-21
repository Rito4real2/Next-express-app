'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/AdminNavbar';

export default function AdminLogin() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // <--- CRITICAL: Allows browser to save HTTP-Only JWT Cookie
        body: JSON.stringify({ userName, emailAddress: userName, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      // Successfully authenticated
      router.push('/admin/dashboard');
      router.refresh(); // Refresh route tree so server components re-evaluate headers/cookies
    } catch (err) {
      setError('An unexpected network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <AdminNavbar />
      <form onSubmit={handleLogin} className="p-8 bg-white rounded shadow-md w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Admin Portal Login</h1>

        {error && (
          <div className="p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">User Name or Email Address</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-2 border rounded mt-1 text-gray-800"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mt-1 text-gray-800"
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full py-2 bg-purple-700 text-white rounded font-medium hover:bg-purple-800 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login as Admin'}
        </button>
      </form>
    </div>
  );
}