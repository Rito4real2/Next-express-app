'use client';

import { useState, SubmitEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function DepositPage() {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit/Debit Card');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const handleDeposit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/transactions/deposit`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ amount: Number(amount), paymentMethod }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to submit deposit request');
        return;
      }

      setStatus(data.message || `Deposit request for $${amount} submitted! Pending admin approval.`);
      setAmount('');
      router.refresh();
    } catch (err: any) {
      console.error('Deposit Fetch Error:', err);
      setError(err?.message || 'Unable to connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-sm border w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Deposit Funds</h1>

        {status && <div className="p-3 bg-green-100 border border-green-300 text-green-800 text-sm rounded">{status}</div>}
        {error && <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-sm rounded">{error}</div>}

        <form onSubmit={handleDeposit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border rounded mt-1 text-gray-800 bg-white"
            >
              <option value="Credit/Debit Card">Credit/Debit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Crypto Wallet">Crypto Wallet</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
            <input
              type="number"
              min="1"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded mt-1 text-gray-800"
              placeholder="100.00"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Deposit Request'}
          </button>
        </form>
      </div>
    </div>
  );
}