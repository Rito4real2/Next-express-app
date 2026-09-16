// client/src/app/users/withdraw/page.tsx
'use client';

// Import SubmitEvent instead of deprecated FormEvent
import { useState, SubmitEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function WithdrawPage() {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Explicitly type the submit event as SubmitEvent<HTMLFormElement>
  const handleWithdrawal = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/transactions/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Ensures HTTP-only auth cookies are sent to Express
        body: JSON.stringify({ amount: Number(amount), paymentMethod }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to submit withdrawal request');
        return;
      }

      setStatus(data.message || `Withdrawal request for $${amount} submitted! Pending admin processing.`);
      setAmount('');
      router.refresh();
    } catch (err) {
      setError('Unable to connect to backend server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-sm border w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Withdraw Funds</h1>

        {status && <div className="p-3 bg-green-100 border border-green-300 text-green-800 text-sm rounded">{status}</div>}
        {error && <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-sm rounded">{error}</div>}

        <form onSubmit={handleWithdrawal} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Withdrawal Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border rounded mt-1 text-gray-800 bg-white"
            >
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Crypto Wallet">Crypto Wallet</option>
              <option value="PayPal">PayPal</option>
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
              placeholder="50.00"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Withdrawal Request'}
          </button>
        </form>
      </div>
    </div>
  );
}