'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import ReceiptModal, { Transaction } from '@/components/ReceiptModal';
import { useTranslation } from 'react-i18next';

export default function WithdrawPage() {
  const [step, setStep] = useState<'details' | 'pin'>('details');

  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [walletAddress, setCryptoAddress] = useState('');
  const [withdrawalPin, setWithdrawalPin] = useState('');

  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const router = useRouter();
  const { t } = useTranslation();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Step 1: Validate details and move to PIN entry screen
  const handleProceedToPin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setStatus(null);

    if (!amount || Number(amount) <= 0) {
      setError(t('withdraw.invalid_amount', 'Please enter a valid withdrawal amount.'));
      return;
    }

    setStep('pin');
  };

  // Step 2: Finalize withdrawal by submitting details + PIN to backend
  const handleFinalWithdrawal = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setError(null);

    const payload: Record<string, any> = {
      amount: Number(amount),
      paymentMethod,
      pin: withdrawalPin,
    };

    if (paymentMethod === 'BANK_TRANSFER') {
      payload.bankDetails = { bankName, accountNumber, accountHolderName };
    } else if (paymentMethod === 'CRYPTO') {
      payload.walletAddress = walletAddress;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/transaction/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t('withdraw.failed_submit', 'Failed to submit withdrawal request'));
        return;
      }

      setStatus(
        data.message ||
          t('withdraw.request_submitted', `Withdrawal request for $${amount} submitted! Pending processing.`, { amount })
      );

      if (data.transaction) {
        setSelectedTransaction(data.transaction);
      }

      // Reset form and return to step 1
      setAmount('');
      setBankName('');
      setAccountNumber('');
      setAccountHolderName('');
      setCryptoAddress('');
      setWithdrawalPin('');
      setStep('details');
      router.refresh();
    } catch (err) {
      setError(t('withdraw.connection_error', 'Unable to connect to backend server. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center font-mono">
      <div className="bg-white p-8 rounded-lg shadow-sm border w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-red-800">{t('withdraw.title', 'Withdraw Funds')}</h1>

        {status && <div className="p-3 bg-green-100 border border-green-300 text-green-800 text-sm rounded">{status}</div>}
        {error && <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-sm rounded">{error}</div>}

        {step === 'details' ? (
          /* STEP 1: Withdrawal Details Form */
          <form onSubmit={handleProceedToPin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-red-400">{t('withdraw.method', 'Withdrawal Method')}</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 border rounded mt-1 text-gray-800 bg-white"
              >
                <option value="BANK_TRANSFER">{t('withdraw.bank_transfer', 'Bank Transfer')}</option>
                <option value="CRYPTO">{t('withdraw.crypto_wallet', 'Crypto Wallet')}</option>
                <option value="PAYPAL">{t('withdraw.paypal', 'PayPal')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-red-400">{t('withdraw.amount', 'Amount ($)')}</label>
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

            {paymentMethod === 'BANK_TRANSFER' && (
              <div className="space-y-3 pt-2 border-t">
                <p className="text-xs font-semibold text-gray-500 uppercase">{t('withdraw.bank_info', 'Bank Information')}</p>
                <div>
                  <label className="block text-sm font-medium text-red-400">{t('withdraw.bank_name', 'Bank Name')}</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full p-2 border rounded mt-1 text-gray-800"
                    placeholder={t('withdraw.bank_name_placeholder', 'e.g. Chase Bank')}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-red-400">{t('withdraw.account_number', 'Account Number')}</label>
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
                  <label className="block text-sm font-medium text-red-400">{t('withdraw.account_holder_name', 'Account Holder Name')}</label>
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

            {paymentMethod === 'CRYPTO' && (
              <div className="space-y-3 pt-2 border-t">
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('withdraw.wallet_address', 'Crypto Wallet Address')}</label>
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
              className="w-full py-2 bg-gradient-to-r from-red-950 via-red-900 to-red-800 text-white rounded font-medium hover:bg-red-700 transition cursor-pointer"
            >
              {t('withdraw.continue_to_pin', 'Continue to PIN Verification')}
            </button>
          </form>
        ) : (
          /* STEP 2: PIN Verification Form */
          <form onSubmit={handleFinalWithdrawal} className="space-y-4">
            <div className="bg-gray-50 p-4 rounded border space-y-1 text-xs text-gray-600">
              <p><span className="font-semibold">Amount:</span> ${amount}</p>
              <p><span className="font-semibold">Method:</span> {paymentMethod}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-red-600 mb-1">
                {t('withdraw.security_pin', 'Enter Withdrawal Security PIN')}
              </label>
              <input
                type="password"
                maxLength={6}
                value={withdrawalPin}
                onChange={(e) => setWithdrawalPin(e.target.value)}
                className="w-full p-2 border rounded text-gray-800 tracking-widest text-center text-lg"
                placeholder="••••"
                required
                autoFocus
              />
              <p className="text-[10px] text-gray-400 mt-1">
                Enter the security PIN provided by the administrator to authorize this request.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="w-1/3 py-2 bg-gray-200 text-gray-800 rounded font-medium hover:bg-gray-300 transition cursor-pointer text-xs"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 py-2 bg-gradient-to-r from-red-950 via-red-900 to-red-800 text-white rounded font-medium hover:bg-red-700 transition disabled:opacity-50 cursor-pointer text-xs"
              >
                {loading ? t('withdraw.submitting', 'Processing...') : t('withdraw.confirm_submit', 'Confirm & Authorize')}
              </button>
            </div>
          </form>
        )}
      </div>

      <ReceiptModal transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />
    </div>
  );
}