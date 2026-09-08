// client/src/app/dashboard/UserLogoutButton.tsx
'use client';

import { useRouter } from 'next/navigation';

export default function UserLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch( process.env.NEXT_PUBLIC_API_URL + '/api/auth/logout', { method: 'POST' });
      router.push('/users/login');
      router.refresh();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded hover:bg-gray-300 transition"
    >
      Log Out
    </button>
  );
}