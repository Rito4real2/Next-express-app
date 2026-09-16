// client/src/app/users/withdraw/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
// 1. Import ReceiptModal and Transaction type
import ReceiptModal, { Transaction } from '@/components/ReceiptModal';

export default function WithdrawPage() {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER');
  
  // Conditional form fields
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [walletAddress, setCryptoAddress] = useState('');

  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 2. State to hold the transaction for the modal
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const handleWithdrawal = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setError(null);

    // Build payload according to selected payment method
    const payload: Record<string, any> = {
      amount: Number(amount),
      paymentMethod,
    };

    if (paymentMethod === 'BANK_TRANSFER') {
      payload.bankDetails = {
        bankName,
        accountNumber,
        accountHolderName,
      };
    } else if (paymentMethod === 'CRYPTO') {
      payload.walletAddress = walletAddress;
    }

    try {
      // NOTE: Ensure route endpoint is plural '/api/transactions/withdraw' to match server setup
      const res = await fetch(`${API_BASE_URL}/api/transaction/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to submit withdrawal request');
        return;
      }

      setStatus(data.message || `Withdrawal request for $${amount} submitted! Pending processing.`);
      
      // 3. Store the created transaction response to trigger the receipt modal
      if (data.transaction) {
        setSelectedTransaction(data.transaction);
      }

      // Reset form state
      setAmount('');
      setBankName('');
      setAccountNumber('');
      setAccountHolderName('');
      setCryptoAddress('');
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
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CRYPTO">Crypto Wallet</option>
              <option value="PAYPAL">PayPal</option>
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

          {/* Conditional Bank Details */}
          {paymentMethod === 'BANK_TRANSFER' && (
            <div className="space-y-3 pt-2 border-t">
              <p className="text-xs font-semibold text-gray-500 uppercase">Bank Information</p>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full p-2 border rounded mt-1 text-gray-800"
                  placeholder="e.g. Chase Bank"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full p-2 border rounded mt-1 text-gray-800"
                  placeholder="0123456789"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Holder Name</label>
                <input
                  type="text"
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  className="w-full p-2 border rounded mt-1 text-gray-800"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>
          )}

          {/* Conditional Crypto Address */}
          {paymentMethod === 'CRYPTO' && (
            <div className="space-y-3 pt-2 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700">Crypto Wallet Address</label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setCryptoAddress(e.target.value)}
                  className="w-full p-2 border rounded mt-1 text-gray-800"
                  placeholder="0x... or bc1..."
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Withdrawal Request'}
          </button>
        </form>
      </div>

      {/* 4. Render ReceiptModal Component */}
      <ReceiptModal 
        transaction={selectedTransaction} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}