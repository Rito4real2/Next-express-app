// client/src/app/dashboard/ProfileForm.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface UserProfile {
  fullName: string;
  userName: string;
  gender: string;
}

export default function ProfileForm({ user }: { user: UserProfile }) {
  const [fullName, setFullName] = useState(user.fullName);
  const [userName, setUserName] = useState(user.userName);
  const [gender, setGender] = useState(user.gender);

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch( process.env.NEXT_PUBLIC_API_URL + '/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, userName, gender }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatusMessage('Profile updated successfully!');
        router.refresh();
      } else {
        setErrorMessage(data.error || 'Failed to update profile');
      }
    } catch (err) {
      setErrorMessage('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      {statusMessage && (
        <div className="p-3 bg-green-100 border border-green-300 text-green-800 text-sm rounded">
          {statusMessage}
        </div>
      )}
      {errorMessage && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-sm rounded">
          {errorMessage}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-2 border rounded mt-1"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full p-2 border rounded mt-1"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Gender</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full p-2 border rounded mt-1"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}