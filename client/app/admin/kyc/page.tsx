'use client';

import React, { useState, useEffect } from 'react';

interface PendingUser {
  _id: string;
  fullName: string;
  userName: string;
  emailAddress: string;
  kycDocumentUrl: string;
  kycStatus: string;
}

export default function AdminKycPage() {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const fetchPendingKyc = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/auth/kyc/pending`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load pending KYC');
      setUsers(data.users);
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingKyc();
  }, []);

  const handleStatusUpdate = async (userId: string, status: 'VERIFIED' | 'REJECTED') => {
    let rejectionReason = '';
    if (status === 'REJECTED') {
      rejectionReason = prompt('Enter reason for rejection (optional):') || '';
    }

    try {
      const res = await fetch(`${backendUrl}/api/auth/kyc/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rejectionReason }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update status');

      // Remove the user from the pending list view
      setUsers(users.filter((u) => u._id !== userId));
      setMessage(data.message);
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading pending KYC requests...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin KYC Review Dashboard</h1>

        {message && <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm">{message}</div>}

        {users.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
            No pending KYC verification requests at the moment.
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Preview</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => {
                  const isImage = user.kycDocumentUrl && /\.(jpeg|jpg|png|webp|avif)$/i.test(user.kycDocumentUrl);

                  return (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.fullName || user.userName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.emailAddress}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {isImage ? (
                          <a
                            href={user.kycDocumentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block group relative w-16 h-16"
                          >
                            <img
                              src={user.kycDocumentUrl}
                              alt="KYC Preview"
                              className="w-16 h-16 object-cover rounded-md border border-gray-200 shadow-sm group-hover:opacity-85 transition"
                            />
                            <span className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-[10px] font-medium opacity-0 group-hover:opacity-100 rounded-md transition">
                              Zoom ↗
                            </span>
                          </a>
                        ) : (
                          <a
                            href={user.kycDocumentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-xs font-medium hover:bg-blue-100 transition border border-blue-200"
                          >
                            📄 View PDF Document ↗
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(user._id, 'VERIFIED')}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(user._id, 'REJECTED')}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}