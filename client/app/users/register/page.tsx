'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../../../lib/locales/i18n'; // Force i18n instance initialization safely
import { useTranslation } from 'react-i18next';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    userName: '',
    emailAddress: '',
    password: '',
    confirmPassword: '',
    gender: 'male',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { t, i18n } = useTranslation();
  
  const [selectedLang, setSelectedLang] = useState<string>('en');

  // Keep selectedLang in sync with i18n instance on mount and upon language change
  useEffect(() => {
    if (i18n.language) {
      setSelectedLang(i18n.language);
    }

    const onLanguageChange = (lng: string) => {
      setSelectedLang(lng);
    };

    i18n.on('languageChanged', onLanguageChange);

    return () => {
      i18n.off('languageChanged', onLanguageChange);
    };
  }, [i18n]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passwords_do_not_match', 'Passwords do not match'));
      return;
    }

    if (formData.password.length < 6) {
      setError(t('auth.password_too_short', 'Password must be at least 6 characters long'));
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...payload } = formData;

      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      const res = await fetch(`${backendUrl}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || data?.error || t('auth.registration_failed', 'Registration failed'));
        return;
      }

      router.push('/users/profile');
      router.refresh();
    } catch (err) {
      setError(t('auth.server_error', 'Server connection error. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setSelectedLang(newLang); // Optimistic UI update
    await i18n.changeLanguage(newLang);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('auth.create_account', 'Create an Account')}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {t('auth.register_subtitle', 'Sign up to get started with your account.')}
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('auth.full_name_label', 'Full Name')}</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('auth.full_name_placeholder', 'John Doe')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('auth.username', 'Username')}</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('auth.user_name_placeholder', 'johndoe')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('auth.email_address', 'Email Address')}</label>
            <input
              type="email"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('auth.email_address_placeholder', 'john@example.com')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('auth.gender', 'Gender')}</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="male">{t('auth.gender_male', 'Male')}</option>
              <option value="female">{t('auth.gender_female', 'Female')}</option>
              <option value="other">{t('auth.gender_other', 'Other')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('auth.password', 'Password')}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('auth.password_placeholder', '••••••••')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('auth.confirm_password', 'Confirm Password')}</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('auth.confirm_password_placeholder', '••••••••')}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? t('auth.creating_account', 'Creating Account...') : t('auth.register', 'Register')}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          {t('auth.already_have_account', 'Already have an account?')}
          {" "}
          <Link
            href="/users/login"
            className="text-blue-600 font-medium hover:underline"
          >
            {t('auth.login_here', 'Log in here')}
          </Link>
        </p>
      </div>
    </div>
  );
}