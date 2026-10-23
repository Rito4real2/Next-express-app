'use client';

import React, { useState, useEffect } from 'react';

interface EmailProps {
  email: string;
  isVerified: boolean;
}

export default function EmailVerification({ email, isVerified }: EmailProps) {
  const [verified, setVerified] = useState(isVerified);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifyingToken, setVerifyingToken] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Keep local state in sync if parent profile data updates
  useEffect(() => {
    setVerified(isVerified);
  }, [isVerified]);

  // Automatically check for token in URL on component mount
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');

    if (token) {
      verifyEmailWithToken(token);
    }
  }, []);

  // 1. Send / Resend Verification Email (POST)
  const handleResend = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${backendUrl}/api/users/verify-email/request`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send verification email');

      setMessage('Verification link sent! Check your inbox (and spam folder).');
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify Email using Token from URL (GET)
  const verifyEmailWithToken = async (token: string) => {
    setVerifyingToken(true);
    setMessage('Verifying your email...');
    try {
      const res = await fetch(`${backendUrl}/api/users/verify-email/${token}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid or expired verification link');

      setVerified(true);
      setMessage('Email verified successfully!');

      window.dispatchEvent(new Event('authChange'));
      
      // Clean up the token from the URL bar without reloading the page
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setVerifyingToken(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
      <h2 className="text-lg font-semibold mb-2 text-gray-800">Email Verification</h2>
      <p className="text-sm text-gray-500 mb-4">
        Registered Email: <span className="font-medium text-gray-700">{email}</span>
      </p>

      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md mb-4 text-sm">
        <span>Status:</span>
        {verified ? (
          <span className="text-green-600 font-bold">Verified</span>
        ) : (
          <span className="text-amber-600 font-bold">Unverified</span>
        )}
      </div>

      {message && <p className="text-sm text-blue-600 mb-4 font-medium">{message}</p>}

      {!verified && (
        <button
          onClick={handleResend}
          disabled={loading || verifyingToken}
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 text-sm font-medium disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Resend Verification Email'}
        </button>
      )}
    </div>
  );
}