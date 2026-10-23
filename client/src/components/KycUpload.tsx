'use client';

import React, { useState, useEffect } from 'react';

interface KycProps {
  kycStatus: string; // 'PENDING', 'VERIFIED', 'REJECTED', 'NOT_SUBMITTED'
  rejectionReason?: string;
}

export default function KycUpload({ kycStatus = 'NOT_SUBMITTED', rejectionReason }: KycProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState(kycStatus);
  const [reason, setReason] = useState(rejectionReason);
  const [message, setMessage] = useState({ text: '', isError: false });
  const [loading, setLoading] = useState(false);

  // Keep local state in sync if parent profile data updates
  useEffect(() => {
    setStatus(kycStatus);
    setReason(rejectionReason);
  }, [kycStatus, rejectionReason]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('document', file);

    setLoading(true);
    setMessage({ text: '', isError: false });
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/users/kyc`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'KYC upload failed');

      setStatus('PENDING');
      setReason(undefined); // Clear old rejection reason on re-upload
      setMessage({ text: 'KYC document submitted successfully. Awaiting admin review.', isError: false });
      setFile(null);
    } catch (err: any) {
      setMessage({ text: err.message, isError: true });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'VERIFIED': return <span className="text-green-600 font-bold">Verified</span>;
      case 'PENDING': return <span className="text-amber-600 font-bold">Pending Review</span>;
      case 'REJECTED': return <span className="text-red-600 font-bold">Rejected</span>;
      default: return <span className="text-gray-600 font-bold">Not Submitted</span>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
      <h2 className="text-lg font-semibold mb-2 text-gray-800">KYC Verification</h2>
      <p className="text-sm text-gray-500 mb-4">Upload a valid government-issued ID (Passport, ID Card, or Driver's License).</p>
      
      <div className="mb-4 p-3 bg-gray-50 rounded-md flex justify-between items-center text-sm">
        <span>Current Status:</span>
        {getStatusBadge()}
      </div>

      {status === 'REJECTED' && reason && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          <strong>Rejection Reason:</strong> {reason}
        </div>
      )}

      {message.text && (
        <div className={`p-3 mb-4 rounded text-sm ${message.isError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message.text}
        </div>
      )}

      {status !== 'VERIFIED' && status !== 'PENDING' && (
        <form onSubmit={handleUpload} className="space-y-4">
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required
          />
          <button
            type="submit"
            disabled={!file || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Submit KYC Document'}
          </button>
        </form>
      )}
    </div>
  );
}