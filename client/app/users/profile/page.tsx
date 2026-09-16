// client/src/app/dashboard/page.tsx
import { headers, cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import UserLogoutButton from './UserLogoutButton';

interface UserProfile {
  _id: string;
  fullName: string;
  userName: string;
  emailAddress: string;
  gender: string;
  balance: number;
  role: 'user' | 'admin';
}

export const dynamic = 'force-dynamic';

export function navBar() {
  return (
    <Navbar />
  );
}

async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const headersList = await headers();
    const cookieStore = await cookies();
    
    // 1. Construct absolute URL dynamically for SSR
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const apiUrl = `${protocol}://${host}/api/users/profile`;

    // 2. Pass authorization/cookie headers directly
    const cookieHeader = cookieStore.toString();

    const res = await fetch(apiUrl, {
      headers: { 
        Cookie: cookieHeader 
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Failed to fetch user profile during SSR:', error);
    return null;
  }
}

export default async function UserDashboard() {
  const user = await getUserProfile();

  if (!user) {
    redirect('/users/login');
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white p-6 rounded-lg border shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, {user.fullName}!
            </h1>
            <p className="text-sm text-gray-500">@{user.userName}</p>
          </div>
          <UserLogoutButton />
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <p className="text-sm font-medium text-gray-500">Account Balance</p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              ${user.balance.toLocaleString()}
            </p>
          <div className="mt-4">
            <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 transition">
              <Link href="/users/deposit">Deposit Funds</Link>
            </button>
            <button className="mt-4 ml-2 px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition">
              <Link href="/users/withdraw">Withdraw Funds</Link>
            </button>
          </div>

          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <p className="text-sm font-medium text-gray-500">Account Type</p>
            <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-semibold capitalize">
              {user.role}
            </span>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <p className="text-sm font-medium text-gray-500">Email Address</p>
            <p className="text-lg font-semibold text-gray-800 mt-1 truncate">
              {user.emailAddress}
            </p>
          </div>
        </div>
    </div>
    </div>
  );
}