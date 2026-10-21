// client/src/app/admin/dashboard/LogoutButton.tsx
'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const API_BASED_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
    try {
      await fetch(`${API_BASED_URL}/api/users/logout`, { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition"
    >
      Sign Out
    </button>
  );
}