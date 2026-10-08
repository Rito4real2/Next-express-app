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
}

interface ProfileDashboardClientProps {
  user: UserProfile;
  children: React.ReactNode; // For UserLogoutButton
}

export default function ProfileDashboardClient({ user, children }: { user: any; children: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
      
      {/* User Info + Avatar */}
      <div className="flex items-center gap-4">
        

        <div>
          <h1 className="text-xl font-bold text-gray-900">{user.fullName}</h1>
          <p className="text-sm font-mono text-gray-500">@{user.userName}</p>
        </div>
      </div>

      {/* Action / Logout Buttons */}
      {/* <div className="flex items-center gap-3">
        {children}
      </div> */}

      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-black bg-gray-100 shrink-0">
          <Image
            src={user.avatarUrl || '/default-avatar.png'}
            alt={`${user.fullName}'s Avatar`}
            fill
            className="object-cover"
          />
        </div>

    </div>
  );
}