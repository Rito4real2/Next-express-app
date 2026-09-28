// client/src/app/users/deposit/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import ReceiptModal, { Transaction } from '@/components/ReceiptModal';
import '@/public/i18n'; // Force i18n instance initialization safely
import { useTranslation } from 'react-i18next';

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
  const { t, i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState<string>('en');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Keep selectedLang in sync with i18n instance on mount and upon language change
  useEffect(() => {
    if (i18n.language) {
      setSelectedLang(i18n.language);
    }

    const handleLanguageChange = (lng: string) => {
      setSelectedLang(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const handleLanguageSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setSelectedLang(newLang); // Optimistic UI update
    await i18n.changeLanguage(newLang);
  };

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

      setStatus(
        data.message ||
          t('deposit.request_submitted', `Deposit request for $${amount} submitted! Pending processing.`, { amount })
      );

      // 1. Trigger the Receipt Modal by setting the returned transaction object
      if (data.transaction) {
        setSelectedTransaction(data.transaction);
      }

      // Reset form input
      setAmount('');
      router.refresh();
    } catch (err) {
      setError(
        t('deposit.connection_error', 'Unable to connect to backend server. Please try again.')
      );
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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">{t('deposit.title', 'Deposit Funds')}</h1>

          {/* Language Switcher Dropdown */}
          <select
            value={selectedLang}
            onChange={handleLanguageSelect}
            className="text-sm border rounded p-1 text-gray-700 bg-white"
          >
            <option value="en">EN</option>
            <option value="es">ES</option>
            <option value="fr">FR</option>
          </select>
        </div>

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
            <label className="block text-sm font-medium text-gray-700">
              {t('deposit.payment_method', 'Payment Method')}
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border rounded mt-1 text-gray-800 bg-white"
            >
              <option value="Credit/Debit Card">{t('deposit.card', 'Credit / Debit Card')}</option>
              <option value="BANK_TRANSFER">{t('deposit.bank_transfer', 'Bank Transfer')}</option>
              <option value="CRYPTO">{t('deposit.crypto', 'Crypto')}</option>
            </select>
          </div>

          {/* Conditional Crypto Selection Tag */}
          {paymentMethod === 'CRYPTO' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('deposit.select_crypto', 'Select Cryptocurrency')}
              </label>
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
            <label className="block text-sm font-medium text-gray-700">
              {t('deposit.amount', 'Amount ($)')}
            </label>
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
            {loading ? t('deposit.submitting', 'Submitting...') : t('deposit.submit', 'Submit Deposit Request')}
          </button>
        </form>
      </div>

      {/* Receipt Modal Component */}
      <ReceiptModal 
        transaction={selectedTransaction} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}