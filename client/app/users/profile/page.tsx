// client/src/app/users/profile/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import UserLogoutButton from './UserLogoutButton';
import ReceiptModal, { Transaction } from '@/components/ReceiptModal';
import TransactionHistoryTable from '@/components/TransactionHistoryTable';
import ProfileDashboardClient from './ProfileDashboardClient';

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

async function getDashboardData(): Promise<{ user: UserProfile; transactions: Transaction[] } | null> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    const [profileRes, txRes] = await Promise.all([
      fetch(`${API_BASE_URL}/api/users/profile`, {
        headers: { Cookie: cookieHeader },
        cache: 'no-store',
      }),
      fetch(`${API_BASE_URL}/api/transaction/my-history`, {
        headers: { Cookie: cookieHeader },
        cache: 'no-store',
      }),
    ]);

    if (!profileRes.ok) return null;

    const user = await profileRes.json();
    const txData = txRes.ok ? await txRes.json() : null;

    let rawTransactions: Transaction[] = [];

    if (txData) {
      if (Array.isArray(txData)) {
        rawTransactions = txData;
      } else if (typeof txData === 'object') {
        rawTransactions = 
          txData.transactions || 
          txData.data || 
          txData.docs || 
          txData.history || 
          [];
      }
    }

    return { user, transactions: rawTransactions };
  } catch (error) {
    console.error('Failed to fetch dashboard data during SSR:', error);
    return null;
  }
}

export default async function UserDashboard() {
  const data = await getDashboardData();

  if (!data) {
    redirect('/users/login');
  }

  const { user, transactions } = data;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Header & Stats Client Wrapper */}
          <ProfileDashboardClient user={user}>
            <UserLogoutButton />
          </ProfileDashboardClient>

          {/* Transaction History Section */}
          <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
            {/* Client Component handling table layout & translations */}
            <TransactionHistoryTable transactions={transactions} />
          </div>

        </div>
      </main>
    </div>
  );
}