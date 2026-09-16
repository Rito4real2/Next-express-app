'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export interface UserProfile {
  _id: string;
  fullName: string;
  userName: string;
  emailAddress: string;
  gender: string;
  balance?: number;
  role?: 'user' | 'admin';
}

interface ProfileFormProps {
  initialData?: UserProfile;
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Form input states initialized with provided user data
  const [fullName, setFullName] = useState(initialData?.fullName || '');
  const [userName, setUserName] = useState(initialData?.userName || '');
  const [emailAddress, setEmailAddress] = useState(initialData?.emailAddress || '');
  const [gender, setGender] = useState(initialData?.gender || 'other');

  // UI state management
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Sends HTTP-Only authentication cookies
        body: JSON.stringify({
          fullName,
          userName,
          emailAddress,
          gender,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to update profile settings.');
        return;
      }

      setStatus(data.message || 'Profile updated successfully!');
      router.refresh(); // Refresh Server Components to update stale cached user data
    } catch (err) {
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Profile</h2>

      {/* Alert Notifications */}
      {status && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-800 text-sm rounded">
          {status}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 text-sm rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-2 border rounded mt-1 text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="John Doe"
            required
          />
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-2 border rounded mt-1 text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="johndoe"
            required
          />
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            className="w-full p-2 border rounded mt-1 text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="john@example.com"
            required
          />
        </div>

        {/* Gender Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full p-2 border rounded mt-1 text-gray-800 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other / Prefer not to say</option>
          </select>
        </div>

        {/* Read-only Balance Display (If present) */}
        {initialData?.balance !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-500">Account Balance</label>
            <input
              type="text"
              value={`$${initialData.balance.toFixed(2)}`}
              disabled
              className="w-full p-2 border rounded mt-1 bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Saving Changes...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}