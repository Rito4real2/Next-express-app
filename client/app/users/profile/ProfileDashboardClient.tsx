// client/src/app/users/profile/ProfileDashboardClient.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import '@/public/i18n';

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

export default function ProfileDashboardClient({ user, children }: ProfileDashboardClientProps) {
  const { t } = useTranslation();

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-lg border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {t('dashboard.welcome', 'Welcome back, {{name}}!', { name: user.fullName })}
          </h1>
          <p className="text-sm text-gray-500">@{user.userName}</p>
        </div>
        {children}
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            {t('dashboard.account_balance', 'Account Balance')}
          </p>
          <p className="text-3xl font-bold text-green-600 mt-1">
            ${user.balance.toLocaleString()}
          </p>
          <div className="mt-4 flex gap-2">
            <Link 
              href="/users/deposit"
              className="px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 transition inline-block text-center text-sm"
            >
              {t('dashboard.deposit_funds', 'Deposit Funds')}
            </Link>
            <Link 
              href="/users/withdraw"
              className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition inline-block text-center text-sm"
            >
              {t('dashboard.withdraw_funds', 'Withdraw Funds')}
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            {t('dashboard.account_type', 'Account Type')}
          </p>
          <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-semibold capitalize">
            {user.role}
          </span>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            {t('dashboard.email_address', 'Email Address')}
          </p>
          <p className="text-lg font-semibold text-gray-800 mt-1 truncate">
            {user.emailAddress}
          </p>
        </div>
      </div>
    </>
  );
}