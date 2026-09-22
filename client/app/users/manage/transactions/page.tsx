'use client';

import { useState, useEffect, useCallback } from 'react';
import ProofModal from '@/components/ProofModal';

interface TransactionUser {
  fullName?: string;
  emailAddress?: string;
}

interface BankDetails {
  bankName?: string;
  accountNumber?: string;
  accountHolderName?: string;
}

interface Transaction {
  _id: string;
  user?: TransactionUser;
  type: string;
  amount: number | string;
  paymentMethod?: string;
  proofOfPayment?: string;
  status: string;
  walletAddress?: string;
  bankDetails?: BankDetails;
  createdAt?: string;
}

export default function AdminDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [activeProofUrl, setActiveProofUrl] = useState<string | null>(null);
  const [selectedTxDetails, setSelectedTxDetails] = useState<Transaction | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch transactions from Express backend
  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    try {
      const response = await fetch(`${API_BASE_URL}/api/transaction/all`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to load transactions`);
      }

      const data = await response.json();
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
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update status to ${status}`);
      }

      setActionMessage(`Transaction successfully ${status.toLowerCase()}.`);

      // Optimistic state update
      setTransactions((prev) =>
        prev.map((tx) => (tx._id === id ? { ...tx, status } : tx))
      );
    } catch (err: any) {
      setError(err.message || 'Status update failed.');
    } finally {
      setUpdatingId(null);
    }
  };

  const copyToClipboard = (text: string, idKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(idKey);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
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
            <table className="w-full text-left border-collapse min-w-[950px]">
              <thead>
                <tr className="bg-gray-50 border-b text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="p-4 min-w-[160px]">User</th>
                  <th className="p-4 min-w-[90px]">Type</th>
                  <th className="p-4 min-w-[100px]">Amount</th>
                  <th className="p-4 min-w-[110px]">Method</th>
                  <th className="p-4 min-w-[200px]">Withdrawal / Pay Details</th>
                  <th className="p-4 min-w-[110px]">Receipt</th>
                  <th className="p-4 min-w-[100px]">Status</th>
                  <th className="p-4 min-w-[150px] text-right sm:text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm text-gray-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500">
                      Loading transactions...
                    </td>
                  </tr>
                ) : transactions.length > 0 ? (
                  transactions.map((tx) => {
                    const methodUpper = tx.paymentMethod?.toUpperCase() || '';
                    const isBank = methodUpper === 'BANK_TRANSFER' || methodUpper === 'BANK';
                    const hasBankDetails = Boolean(tx.bankDetails?.accountNumber);
                    const hasWallet = Boolean(tx.walletAddress);

                    return (
                      <tr key={tx._id} className="hover:bg-gray-50 transition-colors">
                        {/* User Info */}
                        <td className="p-4">
                          <p className="font-semibold text-gray-900 truncate max-w-[160px]">
                            {tx.user?.fullName || 'Unknown User'}
                          </p>
                          <p className="text-xs text-gray-500 truncate max-w-[160px]">
                            {tx.user?.emailAddress}
                          </p>
                        </td>

                        {/* Transaction Type */}
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

                        {/* Amount */}
                        <td className="p-4 font-medium whitespace-nowrap">
                          ${typeof tx.amount === 'number' ? tx.amount.toFixed(2) : tx.amount}
                        </td>

                        {/* Payment Method */}
                        <td className="p-4 whitespace-nowrap uppercase text-xs font-semibold text-gray-600">
                          {tx.paymentMethod || 'N/A'}
                        </td>

                        {/* Withdrawal / Pay Details */}
                        <td className="p-4">
                          {hasWallet ? (
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded border text-gray-800 max-w-[130px] truncate">
                                {tx.walletAddress}
                              </span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(tx.walletAddress!, tx._id)}
                                className="text-[10px] px-1.5 py-0.5 bg-gray-200 hover:bg-gray-300 rounded font-medium text-gray-700"
                              >
                                {copiedId === tx._id ? 'Copied' : 'Copy'}
                              </button>
                            </div>
                          ) : hasBankDetails ? (
                            <div className="text-xs space-y-0.5">
                              <p className="font-semibold text-gray-900">
                                {tx.bankDetails?.bankName}
                              </p>
                              <p className="font-mono text-gray-600">
                                Acc: {tx.bankDetails?.accountNumber}
                              </p>
                              <p className="text-gray-500 text-[11px]">
                                {tx.bankDetails?.accountHolderName}
                              </p>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">No details</span>
                          )}

                          {(hasWallet || hasBankDetails) && (
                            <button
                              type="button"
                              onClick={() => setSelectedTxDetails(tx)}
                              className="mt-1 text-[11px] text-blue-600 hover:underline block font-medium"
                            >
                              View full details
                            </button>
                          )}
                        </td>

                        {/* Receipt */}
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

                        {/* Status */}
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

                        {/* Actions */}
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
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500">
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

      {/* Withdrawal & Payment Details Modal */}
      {selectedTxDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border relative">
            <button
              onClick={() => setSelectedTxDetails(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">
              Payment & Destination Details
            </h3>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-500">User:</span>
                <span className="font-semibold">{selectedTxDetails.user?.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Transaction Type:</span>
                <span className="font-semibold uppercase">{selectedTxDetails.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Method:</span>
                <span className="font-semibold uppercase">{selectedTxDetails.paymentMethod}</span>
              </div>

              {selectedTxDetails.walletAddress && (
                <div className="border-t pt-3 space-y-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Crypto Wallet Address</p>
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded border gap-2">
                    <span className="font-mono text-xs text-gray-800 break-all select-all">
                      {selectedTxDetails.walletAddress}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(selectedTxDetails.walletAddress!, 'modal-wallet')}
                      className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 whitespace-nowrap"
                    >
                      {copiedId === 'modal-wallet' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}

              {selectedTxDetails.bankDetails && (
                <div className="border-t pt-3 space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Bank Account Information</p>
                  <div className="bg-gray-50 p-3 rounded border space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-xs">Bank Name:</span>
                      <span className="font-medium text-gray-800">{selectedTxDetails.bankDetails.bankName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-xs">Account Name:</span>
                      <span className="font-medium text-gray-800">{selectedTxDetails.bankDetails.accountHolderName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-xs">Account Number:</span>
                      <span className="font-mono font-bold text-gray-800 select-all">{selectedTxDetails.bankDetails.accountNumber || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedTxDetails(null)}
                className="w-full py-2 bg-gray-800 text-white rounded-md text-sm font-semibold hover:bg-gray-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}