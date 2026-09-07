'use client';

import { useState, useEffect, FormEvent } from 'react';

interface User {
  _id: string;
  fullName: string;
  userName: string;
  emailAddress: string;
  password: string;
  gender: string;
  balance: number;
  role: 'user' | 'admin';
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form States
  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('male');
  const [balance, setBalance] = useState(0);
  const [role, setRole] = useState<'user' | 'admin'>('user');

  const [editingId, setEditingId] = useState<string | null>(null);

  // Load Users
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (res.ok) setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Form Handler (POST / PUT)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (editingId) {
      // --- PUT (Update) ---
      const res = await fetch(`/api/users/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, userName, emailAddress, gender, balance, role }),
      });

      const data = await res.json();
      if (res.ok) {
        resetForm();
        fetchUsers();
      } else {
        setErrorMessage(data.error || 'Failed to update user');
      }
    } else {
      // --- POST (Create) ---
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, userName, emailAddress, password, gender, balance, role }),
      });

      const data = await res.json();
      if (res.ok) {
        resetForm();
        fetchUsers();
      } else {
        setErrorMessage(data.error || 'Failed to create user');
      }
    }
  };

  // --- DELETE (Triggers custom hook logic) ---
  const handleDelete = async (id: string) => {
    setErrorMessage(null);
    if (!confirm('Are you sure you want to delete this user?')) return;

    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
    const data = await res.json();

    if (res.ok) {
      setUsers(users.filter((user) => user._id !== id));
    } else {
      // Handles error from server when user is admin or has balance > 0
      setErrorMessage(data.error);
    }
  };

  const handleEditClick = (user: User) => {
    setEditingId(user._id);
    setFullName(user.fullName);
    setUserName(user.userName);
    setEmailAddress(user.emailAddress);
    setGender(user.gender);
    setBalance(user.balance);
    setRole(user.role);
  };

  const resetForm = () => {
    setEditingId(null);
    setFullName('');
    setUserName('');
    setEmailAddress('');
    setPassword('');
    setGender('male');
    setBalance(0);
    setRole('user');
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      {errorMessage && (
        <div className="p-4 bg-red-100 text-red-700 rounded border border-red-300">
          {errorMessage}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="p-6 bg-gray-50 rounded border space-y-4">
        <h2 className="text-xl font-bold">{editingId ? 'Edit User' : 'Create New User'}</h2>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email Address</label>
            <input
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </div>

           
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded mt-1"
                required
              />
            </div>


          <div>
            <label className="block text-sm font-medium">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-2 border rounded mt-1"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Balance ($)</label>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(Number(e.target.value))}
              className="w-full p-2 border rounded mt-1"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
              className="w-full p-2 border rounded mt-1"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            {editingId ? 'Update User' : 'Create User'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-400 text-white rounded">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* USER LIST */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Registered Users</h2>
        {users.map((u) => (
          <div key={u._id} className="flex items-center justify-between p-4 border rounded bg-white shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{u.fullName}</span>
                <span className="text-xs text-gray-500">(@{u.userName})</span>
                <span className={`text-xs px-2 py-0.5 rounded ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                  {u.role}
                </span>
              </div>
              <p className="text-sm text-gray-600">{u.emailAddress} • {u.gender}</p>
              <p className="text-sm text-gray-600">{u.password}</p>
              <p className="text-sm font-medium text-green-700 mt-1">Balance: ${u.balance}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEditClick(u)}
                className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(u._id)}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}