'use client';

import { useState } from 'react';

// Simple Image Modal Component for Admin Preview
function ProofModal({ imageUrl, onClose }: { imageUrl: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative bg-white p-4 rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold text-xl px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
        >
          ✕
        </button>
        <h3 className="text-lg font-bold text-gray-800 mb-4 self-start">Proof of Payment</h3>
        <div className="overflow-auto w-full max-h-[70vh] flex justify-center bg-gray-50 rounded border p-2">
          <img src={imageUrl} alt="Proof of Payment" className="object-contain max-h-[65vh] rounded" />
        </div>
        <div className="mt-4 flex justify-end w-full">
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition"
          >
            Open Full Size
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard({ transactions = [], error, actionMessage, handleStatusUpdate }: any) {
  const [activeProofUrl, setActiveProofUrl] = useState<string | null>(null);

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
                {transactions.map((tx: any) => (
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
                          tx.type === 'DEPOSIT' || tx.type === 'deposit'
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
                          onClick={() => setActiveProofUrl(tx.proofOfPayment)}
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
                          tx.status === 'APPROVED' || tx.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : tx.status === 'REJECTED' || tx.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>

                    <td className="p-4 whitespace-nowrap text-right sm:text-left">
                      {tx.status === 'PENDING' || tx.status === 'pending' ? (
                        <div className="flex items-center justify-end sm:justify-start gap-2">
                          <button
                            type="button"
                            onClick={() => handleStatusUpdate(tx._id, 'APPROVED')}
                            className="px-3 py-1 bg-green-600 text-white rounded text-xs font-semibold hover:bg-green-700 active:bg-green-800 transition shadow-sm"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusUpdate(tx._id, 'REJECTED')}
                            className="px-3 py-1 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700 active:bg-red-800 transition shadow-sm"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
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