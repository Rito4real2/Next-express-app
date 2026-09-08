// client/src/app/dashboard/page.tsx
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import ProfileForm from './ProfileForm';
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

async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const headersList = await headers();
    const cookieHeader = headersList.get('cookie') || '';

    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/users/profile', {
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    });

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
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

        {/* Profile Settings Section */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Profile Information</h2>
          <ProfileForm user={user} />
        </div>
      </div>
    </div>
  );
}