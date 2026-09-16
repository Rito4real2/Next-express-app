// client/src/app/admin/users/manage/transactions/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface UserRef {
  _id: string;
  fullName: string;
  userName: string;
  emailAddress: string;
  balance: number;
}

interface TransactionItem {
  _id: string;
  user: UserRef;
  type: 'deposit' | 'withdrawal';
  amount: number;
  paymentMethod: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface CurrentUser {
  _id: string;
  role: 'user' | 'admin';
}

export default function AdminTransactionsPage() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loadingTx, setLoadingTx] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // 1. Authenticate and verify Admin access
  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const res = await fetch('/api/users/me', { credentials: 'include' });
        if (res.ok) {
          const userData: CurrentUser = await res.json();
          setCurrentUser(userData);
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error('Failed to authenticate:', err);
        setCurrentUser(null);
      } finally {
        setLoadingAuth(false);
      }
    };

    checkAdminAuth();
  }, []);

  // 2. Fetch transactions if admin check succeeds
  const fetchTransactions = async () => {
    setLoadingTx(true);
    try {
      const res = await fetch('/api/transaction/all', { credentials: 'include' });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to fetch transactions');
        return;
      }

      setTransactions(data);
    } catch (err) {
      setError('Error connecting to the server');
    } finally {
      setLoadingTx(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchTransactions();
    }
  }, [currentUser]);

  // Handle Approve or Reject
  const handleStatusUpdate = async (id: string, newStatus: 'approved' | 'rejected') => {
    setActionMessage(null);
    try {
      const res = await fetch(`/api/transaction/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Failed to update transaction');
        return;
      }

      setActionMessage(`Transaction successfully ${newStatus}!`);
      // Optimistically update state locally
      setTransactions((prev) =>
        prev.map((t) => (t._id === id ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      alert('Server error updating status');
    }
  };

  // Render Guard: Checking Authentication
  if (loadingAuth) {
    return <div className="p-8 text-center text-gray-700">Checking authorization...</div>;
  }

  // Render Guard: Unauthorized / Non-Admin Access
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-red-50 border border-red-200 text-red-700 rounded text-center space-y-2">
        <h2 className="text-lg font-bold">Access Denied</h2>
        <p className="text-sm">You must be logged in as an administrator to manage transactions.</p>
      </div>
    );
  }

  if (loadingTx) return <div className="p-8 text-center text-gray-700">Loading transactions...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard - Transaction Requests</h1>

        {error && <div className="p-4 bg-red-100 border border-red-300 text-red-800 rounded">{error}</div>}
        {actionMessage && <div className="p-4 bg-green-100 border border-green-300 text-green-800 rounded">{actionMessage}</div>}

        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-xs font-semibold text-gray-600 uppercase">
                <th className="p-4">User</th>
                <th className="p-4">Type</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Method</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-800">
              {transactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <p className="font-semibold">{tx.user?.fullName || 'Unknown User'}</p>
                    <p className="text-xs text-gray-500">{tx.user?.emailAddress}</p>
                  </td>
                  <td className="p-4 capitalize">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        tx.type === 'deposit' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className="p-4 font-medium">${tx.amount.toFixed(2)}</td>
                  <td className="p-4">{tx.paymentMethod}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold capitalize ${
                        tx.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : tx.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-4 space-x-2">
                    {tx.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(tx._id, 'approved')}
                          className="px-3 py-1 bg-green-600 text-white rounded text-xs font-semibold hover:bg-green-700 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(tx._id, 'rejected')}
                          className="px-3 py-1 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700 transition"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}