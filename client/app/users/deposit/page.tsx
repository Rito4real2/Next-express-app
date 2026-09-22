// client/src/app/users/deposit/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import ReceiptModal, { Transaction } from '@/components/ReceiptModal';

const CRYPTO_OPTIONS = [
  { id: 'USDT', label: 'USDT (Tether)' },
  { id: 'BTC', label: 'Bitcoin (BTC)' },
  { id: 'ETH', label: 'Ethereum (ETH)' },
  { id: 'SOL', label: 'Solana (SOL)' },
  { id: 'USDC', label: 'USD Coin (USDC)' },
];

export default function DepositPage() {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit/Debit Card');
  const [selectedCrypto, setSelectedCrypto] = useState('USDT');

  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // State to hold the submitted transaction for the Receipt Modal
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const handleDeposit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setError(null);

    // Send specific crypto currency code if payment method is CRYPTO
    const effectivePaymentMethod = paymentMethod === 'CRYPTO' ? selectedCrypto : paymentMethod;

    try {
      const res = await fetch(`${API_BASE_URL}/api/transaction/deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          amount: Number(amount),
          paymentMethod: effectivePaymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to submit deposit request');
        return;
      }

      setStatus(data.message || `Deposit request for $${amount} submitted! Pending processing.`);

      // 1. Trigger the Receipt Modal by setting the returned transaction object
      if (data.transaction) {
        setSelectedTransaction(data.transaction);
      }

      // Reset form input
      setAmount('');
      router.refresh();
    } catch (err) {
      setError('Unable to connect to backend server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedTransaction(null);
    router.push('/users/profile');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-sm border w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Deposit Funds</h1>

        {status && (
          <div className="p-3 bg-green-100 border border-green-300 text-green-800 text-sm rounded">
            {status}
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleDeposit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border rounded mt-1 text-gray-800 bg-white"
            >
              <option value="Credit/Debit Card">Credit / Debit Card</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CRYPTO">Crypto</option>
            </select>
          </div>

          {/* Conditional Crypto Selection Tag */}
          {paymentMethod === 'CRYPTO' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Cryptocurrency</label>
              <select
                value={selectedCrypto}
                onChange={(e) => setSelectedCrypto(e.target.value)}
                className="w-full p-2 border rounded mt-1 text-gray-800 bg-white"
              >
                {CRYPTO_OPTIONS.map((crypto) => (
                  <option key={crypto.id} value={crypto.id}>
                    {crypto.label}
                  </option>
                ))}
              </select>
            </div>
          )}

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
            className="w-full py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Submitting...' : 'Submit Deposit Request'}
          </button>
        </form>
      </div>

      {/* 2. Receipt Modal Component */}
      <ReceiptModal 
        transaction={selectedTransaction} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}