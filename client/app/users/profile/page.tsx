'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import UserLogoutButton from './UserLogoutButton';
import ReceiptModal, { Transaction } from '@/components/ReceiptModal';
import TransactionHistoryTable from '@/components/TransactionHistoryTable';
import ProfileDashboardClient from './ProfileDashboardClient';
import AccountDetails from '@/components/AccountDetails';
import BuyPlanCard from '@/components/BuyPlanCard';
import ActiveInvestmentsList from '@/components/ActiveInvestmentsList';
import UserChatWidget from '@/components/UserChatWidget';

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

interface InvestmentPlan {
  _id?: string;
  id?: string;
  name: string;
  durationDays: number;
  profitPercentage: number;
  minInvestment: number;
  maxInvestment: number;
}

export default function UserDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ 
    user: UserProfile; 
    transactions: Transaction[]; 
    plans: InvestmentPlan[];
    investments: any[];
  } | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

        const [profileRes, txRes, plansRes, investmentRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/users/profile`, {
            cache: 'no-store',
            credentials: 'include'
          }),
          fetch(`${API_BASE_URL}/api/transaction/my-history`, {
            cache: 'no-store',
            credentials: 'include'
          }),
          fetch(`${API_BASE_URL}/api/investments/admin/plans`, {
            cache: 'no-store',
            credentials: 'include'
          }),
          fetch(`${API_BASE_URL}/api/investment/plans`, {
            cache: 'no-store',
            credentials: 'include'
          }),
          fetch(`${API_BASE_URL}/api/investment/my-investments`, {
            cache: 'no-store', 
            credentials: 'include' 
          }),
        ]);

        if (!profileRes.ok) {
          router.push('/users/login');
          return;
        }

        const user = await profileRes.json();
        const txData = txRes.ok ? await txRes.json() : null;
        const plansData = plansRes.ok ? await plansRes.json() : [];
        const investmentData = investmentRes.ok ? await investmentRes.json() : [];

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

        const plans = Array.isArray(plansData) ? plansData : plansData.plans || [];
        const investments = Array.isArray(investmentData) ? investmentData : investmentData.investments || [];

        setData({ user, transactions: rawTransactions, plans, investments });
      } catch (error) {
        console.error('Failed to fetch dashboard data on client:', error);
        router.push('/users/login');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 font-mono flex items-center justify-center">
        <p className="text-sm text-gray-600 animate-pulse">Loading profile dashboard...</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { user, transactions, plans, investments } = data;
  const userAvatarUrl = user.avatarUrl || '/default-avatar.png';

  return (
    <div className="min-h-screen bg-gray-100 font-mono">
      <main className="p-4 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Header & Stats Client Wrapper */}
          <ProfileDashboardClient user={{ ...user, avatarUrl: userAvatarUrl }}>
            <UserLogoutButton />
          </ProfileDashboardClient>

          {/* Account Details Section */}
          <AccountDetails user={{ ...user }} />

          {/* Buy Plan Section */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Available Investment Plans</h2>
              <p className="text-xs text-gray-500">Select a plan to invest your account balance.</p>
            </div>

            {plans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plans.map((plan) => (
                  <BuyPlanCard key={plan._id || plan.id} plan={plan} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg border text-center text-xs text-gray-500">
                No active investment plans available at the moment.
              </div>
            )}
          </div>

          {/* Active Investments Portfolio Section */}
          <ActiveInvestmentsList investments={investments} />

          {/* Transaction History Section */}
          <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Transaction History</h2>
            <TransactionHistoryTable transactions={transactions} />
          </div>

        </div>
      </main>

      {/* Render Support Chat Widget in the bottom right corner */}
      <UserChatWidget user={{ _id: user._id, name: user.fullName }} />
    </div>
  );
}