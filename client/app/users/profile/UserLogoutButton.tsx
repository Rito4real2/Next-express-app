// client/src/app/dashboard/UserLogoutButton.tsx
'use client';

import { useRouter } from 'next/navigation';

export default function UserLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center justify-center px-4 h-11 text-sm sm:text-base text-black font-mono border-[3px] border-black bg-white hover:bg-black hover:text-white transition-colors w-full md:w-auto"
    >
      Log Out
    </button>
  );
}