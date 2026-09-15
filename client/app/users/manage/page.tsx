'use client';

import { useState, useEffect, FormEvent } from 'react';

interface User {
  _id: string;
  fullName: string;
  userName: string;
  emailAddress: string;
  password?: string;
  gender: string;
  balance: number;
  role: 'user' | 'admin';
}

export default function UserManagement() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const [users, setUsers] = useState<User[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form States
  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [changePassword, setChangePassword] = useState(false); // Toggle password update in edit mode
  const [gender, setGender] = useState('male');
  const [balance, setBalance] = useState(0);
  const [role, setRole] = useState<'user' | 'admin'>('user');

  const [editingId, setEditingId] = useState<string | null>(null);

  // 1. Authenticate Current User
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/users/me', { 
          credentials: 'include',
        }); 
        if (res.ok) {
          const userData: User = await res.json();
          setCurrentUser(userData);
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error('Failed to authenticate:', err);
        setCurrentUser(null);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    checkAuth();
  }, []);

  // 2. Load Users list only if current user is admin
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users', { credentials: 'include' });
      const data = await res.json();
      if (res.ok) setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchUsers();
    }
  }, [currentUser]);

  // Form Handler (POST / PUT)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (editingId) {
      // --- PUT (Update) ---
      const updateData: Record<string, any> = { fullName, userName, emailAddress, gender, balance, role };
      if (changePassword && password) {
        updateData.password = password;
      }

      const res = await fetch(`/api/users/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
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

  // --- DELETE ---
  const handleDelete = async (id: string) => {
    setErrorMessage(null);
    if (!confirm('Are you sure you want to delete this user?')) return;

    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
    const data = await res.json();

    if (res.ok) {
      setUsers(users.filter((user) => user._id !== id));
      if (editingId === id) resetForm();
    } else {
      setErrorMessage(data.error || 'Failed to delete user');
    }
  };

  const handleEditClick = (user: User) => {
    setEditingId(user._id);
    setFullName(user.fullName);
    setUserName(user.userName);
    setEmailAddress(user.emailAddress);
    setPassword('');
    setChangePassword(false);
    setGender(user.gender);
    setBalance(user.balance);
    setRole(user.role);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setFullName('');
    setUserName('');
    setEmailAddress('');
    setPassword('');
    setChangePassword(false);
    setGender('male');
    setBalance(0);
    setRole('user');
  };

  // 3. Render Guarding
  if (isLoadingAuth) {
    return <div className="p-8 text-center text-gray-500">Checking authorization...</div>;
  }

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-red-50 border border-red-200 text-red-700 rounded text-center space-y-2">
        <h2 className="text-lg font-bold">Access Denied</h2>
        <p className="text-sm">You must be an administrator to access user management.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      {errorMessage && (
        <div className="p-4 bg-red-100 text-red-700 rounded border border-red-300">
          {errorMessage}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className={`p-6 rounded border space-y-4 transition-colors ${editingId ? 'bg-amber-50/50 border-amber-200' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {editingId ? 'Edit User Details' : 'Create New User'}
          </h2>
          {editingId && (
            <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2.5 py-1 rounded-full border border-amber-300">
              Editing Mode
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2 border rounded mt-1 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-2 border rounded mt-1 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className="w-full p-2 border rounded mt-1 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Password field logic */}
          {!editingId ? (
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded mt-1 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <label className="flex items-center text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={changePassword}
                    onChange={(e) => setChangePassword(e.target.checked)}
                    className="mr-1 rounded text-blue-600"
                  />
                  Update Password?
                </label>
              </div>
              <input
                type="password"
                placeholder={changePassword ? 'Enter new password' : '•••••••• (Unchanged)'}
                value={password}
                disabled={!changePassword}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded mt-1 bg-white disabled:bg-gray-100 disabled:text-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                required={changePassword}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-2 border rounded mt-1 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Balance ($)</label>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(Number(e.target.value))}
              className="w-full p-2 border rounded mt-1 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
              className="w-full p-2 border rounded mt-1 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className={`px-4 py-2 text-white font-medium rounded transition-colors ${
              editingId
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {editingId ? 'Update User' : 'Create User'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-medium transition-colors"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* USER LIST */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Registered Users</h2>
        <div className="grid gap-3">
          {users.map((u) => {
            const isCurrentlyEditing = editingId === u._id;
            return (
              <div
                key={u._id}
                className={`flex items-center justify-between p-4 border rounded transition-all ${
                  isCurrentlyEditing
                    ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400'
                    : 'bg-white border-gray-200 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{u.fullName}</span>
                    <span className="text-xs text-gray-500">(@{u.userName})</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-semibold ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}
                    >
                      {u.role}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {u.emailAddress} • <span className="capitalize">{u.gender}</span>
                  </p>
                  <p className="text-sm font-semibold text-green-700 mt-1">
                    Balance: ${u.balance.toFixed(2)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(u)}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      isCurrentlyEditing
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    }`}
                  >
                    {isCurrentlyEditing ? 'Editing...' : 'Edit'}
                  </button>
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded text-sm font-medium hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}