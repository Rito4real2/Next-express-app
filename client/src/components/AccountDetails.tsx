import React from 'react';
import Link from 'next/link';

interface UserProfile {
  _id: string;
  fullName: string;
  userName: string;
  emailAddress: string;
  gender: string;
  balance: number;
  role: 'user' | 'admin';
  avatarUrl?: string;
}

interface AccountDetailsProps {
  user: UserProfile;
  children?: React.ReactNode;
}

const AccountDetails = ({ user, children }: AccountDetailsProps) => {
  return (
    <div className=" flex flex-col items-center w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Account Section Card */}
      <section className="bg-linear-to-r from-red-950 via-red-900 to-red-800 text-white rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col gap-6 w-85">
        {/* Top Header Row */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium font-mono uppercase tracking-wider text-red-200">
            Accounts
          </span>
          <Link
            href="#"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Account Options"
          >
            {/* Options Icon */}
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </Link>
        </div>

        {/* Balance & Account Number Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end pt-2 border-t border-indigo-500/30">
          <div>
            <span className="text-xs sm:text-sm text-red-200 font-mono block mb-1">Account Type</span>
            <p className="text-sm sm:text-base font-semibold truncate">
              ID: {user._id ? `${user._id.slice(0, 8)}...` : 'N/A'}
            </p>
          </div>
          <div className="sm:text-right">
            <span className="text-xs sm:text-sm text-red-200 font-mono block mb-1">Available Balance</span>
            <p className="text-2xl sm:text-3xl font-bold font-mono tracking-tight">
              ${user.balance !== undefined ? user.balance.toFixed(2) : '0.00'}
            </p>
          </div>
        </div>
      </section>

      {/* Main Action Buttons (Withdraw / Deposit) */}
      <main className="grid grid-cols-2 sm:grid-cols-2 gap-4">
        

        {/* Deposit Link */}
        <Link
          href="/users/deposit"
          className="flex items-center gap-4 p-4 sm:p-5 bg-green-600 dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700 group"
        >
          <div className="w-12 h-12 rounded-lg bg-emerald-400 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold font-mono text-white dark:text-white">Deposit</h3>
            <p className=" font-mono text-xs sm:text-sm text-white">Add Funds</p>
          </div>
        </Link>

        {/* Withdraw Link */}
        <Link
          href="/users/withdraw"
          className="flex items-center gap-4 p-4 sm:p-5 bg-red-800 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700 group"
        >
          <div className="w-10 h-12 rounded-lg bg-red-300 flex items-center justify-center text-red-600 dark:text-red-400 group-hover:scale-105 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-white dark:text-white font-mono">Withdraw</h3>
            <p className="text-xs sm:text-sm text-white font-mono">Transfer Funds</p>
          </div>
        </Link>

      </main>

      {/* Optional Children Container */}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
};

export default AccountDetails;