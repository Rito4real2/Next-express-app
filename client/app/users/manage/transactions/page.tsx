'use client';

import { useState, useEffect, useCallback } from 'react';
import ProofModal from '@/components/ProofModal';

interface TransactionUser {
  fullName?: string;
  emailAddress?: string;
}

interface Transaction {
  _id: string;
  user?: TransactionUser;
  type: string;
  amount: number | string;
  paymentMethod?: string;
  proofOfPayment?: string;
  status: string;
}

export default function AdminDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [activeProofUrl, setActiveProofUrl] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch transactions from Express backend
  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const response = await fetch(`${API_BASE_URL}/api/transaction/all`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Ensure cookies are sent if your backend uses them for auth
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to load transactions`);
      }

      const data = await response.json();
      // Adjust if Express returns data wrapped in a key like { transactions: [...] } or { data: [...] }
      setTransactions(Array.isArray(data) ? data : data.transactions || data.data || []);
    } catch (err: any) {
      setError(err.message || 'Unable to fetch transaction requests.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Handle Approve / Reject actions
  const handleStatusUpdate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setUpdatingId(id);
    setActionMessage(null);
    setError(null);

     const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    try {
      const response = await fetch(`${API_BASE_URL}/api/transaction/${id}/status`, {
        method: 'PATCH', // Change to 'PUT' if your Express route expects PUT
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Ensure cookies are sent if your backend uses them for auth
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update status to ${status}`);
      }

      setActionMessage(`Transaction successfully ${status.toLowerCase()}.`);

      // Optimistic state update so UI updates immediately
      setTransactions((prev) =>
        prev.map((tx) => (tx._id === id ? { ...tx, status } : tx))
      );
    } catch (err: any) {
      setError(err.message || 'Status update failed.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Admin Dashboard - Transaction Requests
        </h1>

        {error && (
          <div className="p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg text-sm sm:text-base">
            {error}
          </div>
        )}
        {actionMessage && (
          <div className="p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg text-sm sm:text-base">
            {actionMessage}
          </div>
        )}

        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-gray-50 border-b text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="p-4 min-w-[180px]">User</th>
                  <th className="p-4 min-w-[100px]">Type</th>
                  <th className="p-4 min-w-[100px]">Amount</th>
                  <th className="p-4 min-w-[120px]">Method</th>
                  <th className="p-4 min-w-[120px]">Receipt</th>
                  <th className="p-4 min-w-[100px]">Status</th>
                  <th className="p-4 min-w-[160px] text-right sm:text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm text-gray-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      Loading transactions...
                    </td>
                  </tr>
                ) : transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <p className="font-semibold text-gray-900 truncate max-w-[200px]">
                          {tx.user?.fullName || 'Unknown User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">
                          {tx.user?.emailAddress}
                        </p>
                      </td>
                      <td className="p-4 capitalize">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                            tx.type?.toUpperCase() === 'DEPOSIT'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td className="p-4 font-medium whitespace-nowrap">
                        ${typeof tx.amount === 'number' ? tx.amount.toFixed(2) : tx.amount}
                      </td>
                      <td className="p-4 whitespace-nowrap">{tx.paymentMethod || 'N/A'}</td>

                      {/* Receipt Column */}
                      <td className="p-4 whitespace-nowrap">
                        {tx.proofOfPayment ? (
                          <button
                            type="button"
                            onClick={() => setActiveProofUrl(tx.proofOfPayment!)}
                            className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition inline-flex items-center gap-1"
                          >
                            🔍 View Proof
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 italic">No proof</span>
                        )}
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-bold capitalize ${
                            tx.status?.toUpperCase() === 'APPROVED'
                              ? 'bg-green-100 text-green-800'
                              : tx.status?.toUpperCase() === 'REJECTED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>

                      <td className="p-4 whitespace-nowrap text-right sm:text-left">
                        {tx.status?.toUpperCase() === 'PENDING' ? (
                          <div className="flex items-center justify-end sm:justify-start gap-2">
                            <button
                              type="button"
                              disabled={updatingId === tx._id}
                              onClick={() => handleStatusUpdate(tx._id, 'APPROVED')}
                              className="px-3 py-1 bg-green-600 text-white rounded text-xs font-semibold hover:bg-green-700 active:bg-green-800 transition shadow-sm disabled:opacity-50"
                            >
                              {updatingId === tx._id ? 'Updating...' : 'Approve'}
                            </button>
                            <button
                              type="button"
                              disabled={updatingId === tx._id}
                              onClick={() => handleStatusUpdate(tx._id, 'REJECTED')}
                              className="px-3 py-1 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700 active:bg-red-800 transition shadow-sm disabled:opacity-50"
                            >
                              {updatingId === tx._id ? 'Updating...' : 'Reject'}
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 font-medium">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Proof Preview Modal */}
      {activeProofUrl && (
        <ProofModal imageUrl={activeProofUrl} onClose={() => setActiveProofUrl(null)} />
      )}
    </div>
  );
}