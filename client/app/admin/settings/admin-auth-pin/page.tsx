'use client';

import { useState, useEffect } from 'react';

export default function AdminPinGenerator() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/users`, {
        credentials: 'include'
      });
      const data = await res.json();
      console.log('users found', res.json())
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleGeneratePin = async (userId: string) => {
    try {
      setMessage('');
      setError('');
      const res = await fetch(`${backendUrl}/api/users/${userId}/generate-pin`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to generate PIN');

      setMessage(`PIN generated successfully for user! New PIN: ${data.withdrawalPin}`);
      fetchUsers(); // Refresh user list
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4 font-mono">
      <h3 className="text-lg font-bold text-gray-900">Withdrawal Security PIN Manager</h3>

      {message && <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded">{message}</div>}
      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">{error}</div>}

      {loading ? (
        <p className="text-xs text-gray-500 animate-pulse">Loading users...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-2.5">User Name</th>
                <th className="p-2.5">Email</th>
                <th className="p-2.5">Current PIN</th>
                <th className="p-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="p-2.5 font-medium">{u.userName}</td>
                  <td className="p-2.5 text-gray-600">{u.emailAddress}</td>
                  <td className="p-2.5 font-bold tracking-widest text-purple-700">
                    {u.withdrawalPin || 'Not Set'}
                  </td>
                  <td className="p-2.5 text-right">
                    <button
                      onClick={() => handleGeneratePin(u._id)}
                      className="px-3 py-1.5 bg-black text-white rounded font-bold hover:bg-gray-800 transition text-[10px] uppercase"
                    >
                      Generate Random PIN
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}