'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import '../../../lib/locales/i18n'; // Force i18n instance initialization safely

export default function UserLoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { t } = useTranslation();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t('auth.login_failed', 'Login failed'));
        return;
      }

      window.dispatchEvent(new Event('authChange'));

      // Redirect user to dashboard
      router.push('/users/profile');
      
    } catch (err) {
      setError(t('auth.server_error', 'Server connection error. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-mono text-gray-900">
            {t('auth.login_title', 'Sign In to Your Account')}
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-mono">
            {t('auth.login_subtitle', 'Enter your credentials to access your portal.')}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-sm rounded font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium font-mono text-gray-700">
              {t('auth.identifier_label', 'Email Address or Username')}
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full p-2 border rounded mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder={t('auth.identifier_placeholder', 'user@example.com or jondoe')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium font-mono text-gray-700">
              {t('auth.password_label', 'Password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center px-4 h-11 text-sm sm:text-base text-black font-mono border-[3px] border-black bg-white hover:bg-black hover:text-white transition-colors w-full md:w-auto"
          >
            {loading 
              ? t('auth.logging_in', 'Logging in...') 
              : t('auth.sign_in', 'Sign In')
            }
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 font-mono">
          {t('auth.no_account', "Don't have an account?")}{' '}
          <Link href="/users/register" className="text-blue-600 font-medium hover:underline">
            {t('auth.register_here', 'Register here')}
          </Link>
        </p>
      </div>
    </div>
  );
}