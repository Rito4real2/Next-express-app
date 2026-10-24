// client/src/app/users/profile/ProfileDashboardClient.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import '../../../lib/locales/i18n';
import Image from 'next/image'

interface UserProfile {
  _id: string;
  fullName: string;
  userName: string;
  emailAddress: string;
  gender: string;
  balance: number;
  role: 'user' | 'admin';
  avatarUrl?: string; // Added avatarUrl field
}

interface ProfileDashboardClientProps {
  user: UserProfile; // For UserLogoutButton
}

export default function ProfileDashboardClient({ user}: { user: UserProfile; }) {
  return (
    <div className="bg-linear-to-r from-red-950 via-red-900 to-red-800 p-6 rounded-xl border border-gray-200 shadow-sm flex md:flex-row items-center justify-between gap-6">
      
      {/* User Info + Avatar */}
      <div className="flex flex-row justify-between items-center gap-4">
        

        <div>
          <h1 className='font-bold text-lg font-mono text-red-200'>Hi,{user.fullName}</h1>
          <p className="text-sm font-mono text-red-200">@{user.userName}</p>
        </div>
      </div>

      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-black bg-gray-100 shrink-0">
          <Image
            src={user.avatarUrl || '/default-avatar.png'}
            alt={`${user.fullName}'Avatar'`}
            fill
            className="object-cover"
            loading='eager'
          />
        </div>

    </div>
  );
}