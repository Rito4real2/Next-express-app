// client/src/app/admin/dashboard/page.tsx
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import LogoutButton from './LogoutButton';

interface AdminDashboardData {
  stats: {
    totalUsers: number;
    totalSystemBalance: number;
    adminCount: number;
  };
  recentUsers: Array<{
    _id: string;
    fullName: string;
    userName: string;
    emailAddress: string;
    role: string;
    balance: number;
  }>;
  currentAdmin: {
    fullName: string;
    emailAddress: string;
  };
}

export const dynamic = 'force-dynamic'; // Ensures the page is always server-rendered and not cached

async function getAdminData(): Promise<AdminDashboardData | null> {
  try {
    // Forward incoming request cookies to Express server
    const headersList = await headers();
    const cookieHeader = headersList.get('cookie') || '';

    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/auth/admin-dashboard-data', {
      headers: {
        Cookie: cookieHeader, // Passes the HTTP-only JWT token cookie to Express
      },
      cache: 'no-store',
    });

    if (res.status === 401 || res.status === 403) {
      return null; // Not authorized or missing token
    }

    if (!res.ok) {
      throw new Error('Failed to fetch admin data');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching admin data:', error);
    return null;
  }
}

export default async function AdminDashboardPage() {
  const data = await getAdminData();

  // Redirect to login if unauthenticated or not an admin
  if (!data) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">
              Welcome back, <span className="font-semibold text-purple-700">{data.currentAdmin.fullName}</span> ({data.currentAdmin.emailAddress})
            </p>
          </div>
          <LogoutButton />
        </div>

        {/* Metrics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total System Users</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{data.stats.totalUsers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total System Balance</p>
            <p className="text-3xl font-bold text-green-600 mt-2">${data.stats.totalSystemBalance.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <p className="text-sm font-medium text-gray-500">Admin Accounts</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">{data.stats.adminCount}</p>
          </div>
        </div>

        {/* Recent Registrations Table */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recently Registered Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Username</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {data.recentUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{user.fullName}</p>
                      <p className="text-xs text-gray-500">{user.emailAddress}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-600">@{user.userName}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs rounded font-medium ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-700">${user.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}