'use client';

import { useState, useEffect, FormEvent, useCallback } from 'react';

type PaymentType = 'BANK_TRANSFER' | 'BTC' | 'USDT' | 'ETH' | 'TRX';

interface PaymentSettings {
  type: PaymentType;
  bankName?: string;
  accountNumber?: string;
  accountHolderName?: string;
  walletAddress?: string;
  network?: string;
  isActive: boolean;
}

const PAYMENT_TYPES: { label: string; value: PaymentType; category: 'bank' | 'crypto' }[] = [
  { label: '🏦 Bank Transfer', value: 'BANK_TRANSFER', category: 'bank' },
  { label: '🪙 Bitcoin (BTC)', value: 'BTC', category: 'crypto' },
  { label: '🪙 Tether (USDT)', value: 'USDT', category: 'crypto' },
  { label: '🪙 Ethereum (ETH)', value: 'ETH', category: 'crypto' },
  { label: '🪙 TRON (TRX)', value: 'TRX', category: 'crypto' },
];

export default function AdminPaymentSettingsForm() {
  const [selectedType, setSelectedType] = useState<PaymentType>('BANK_TRANSFER');
  const [formData, setFormData] = useState<PaymentSettings>({
    type: 'BANK_TRANSFER',
    bankName: '',
    accountNumber: '',
    accountHolderName: '',
    walletAddress: '',
    network: '',
    isActive: true,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isBank = selectedType === 'BANK_TRANSFER';

  // Helper function to paste clipboard text directly into a specific input field
  const handlePaste = async (fieldName: keyof PaymentSettings) => {
    let pastedText = '';

    if (navigator.clipboard && typeof navigator.clipboard.readText === 'function') {
      try {
        pastedText = await navigator.clipboard.readText();
      } catch (err) {
        console.warn('Async Clipboard API failed or permission was denied. Falling back to prompt.', err);
      }
    }

    if (!pastedText) {
      const inputFromPrompt = window.prompt('Paste your copied content below (Press Ctrl+V or Cmd+V):');
      if (inputFromPrompt !== null) {
        pastedText = inputFromPrompt;
      }
    }

    if (pastedText.trim()) {
      setFormData((prev) => ({ ...prev, [fieldName]: pastedText.trim() }));
      setStatusMessage(null);
    }
  };

  const fetchSettings = useCallback(async (typeToFetch: PaymentType) => {
    setIsLoading(true);
    setStatusMessage(null);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

    try {
      const response = await fetch(`${API_BASE_URL}/api/transaction/payment-settings?type=${typeToFetch}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Failed to load settings (Status ${response.status})`);
      }

      const data = await response.json();
      if (data.settings) {
        setFormData({
          type: data.settings.type || typeToFetch,
          bankName: data.settings.bankName || '',
          accountNumber: data.settings.accountNumber || '',
          accountHolderName: data.settings.accountHolderName || '',
          walletAddress: data.settings.walletAddress || '',
          network: data.settings.network || (typeToFetch === 'USDT' ? 'TRC20' : typeToFetch),
          isActive: data.settings.isActive ?? true,
        });
      } else {
        setFormData({
          type: typeToFetch,
          bankName: '',
          accountNumber: '',
          accountHolderName: '',
          walletAddress: '',
          network: typeToFetch === 'USDT' ? 'TRC20' : typeToFetch,
          isActive: true,
        });
      }
    } 
    
    catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Unable to load payment settings.',
      });
    }
    
    finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings(selectedType);
  }, [selectedType, fetchSettings]);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as PaymentType;
    setSelectedType(newType);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${API_BASE_URL}/api/transaction/payment-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, type: selectedType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update payment settings.');
      }

      setStatusMessage({
        type: 'success',
        text: data.message || 'Payment settings updated successfully!',
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'An unexpected error occurred during save.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 sm:p-8">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Admin Payment Settings</h2>
        <p className="text-sm text-gray-500 mt-1">
          Configure payment options and wallet details available to users during deposits.
        </p>
      </div>

      <div className="mb-6">
        <label htmlFor="paymentType" className="block text-sm font-semibold text-gray-700 mb-2">
          Select Payment Option to Configure:
        </label>
        <select
          id="paymentType"
          value={selectedType}
          onChange={handleTypeChange}
          className="w-full sm:w-72 px-3 py-2 border rounded-lg text-sm font-medium bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          {PAYMENT_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {statusMessage && (
        <div
          className={`p-4 mb-6 rounded-lg text-sm font-medium border ${
            statusMessage.type === 'success'
              ? 'bg-green-50 text-green-800 border-green-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
            <div>
              <span className="text-sm font-semibold text-gray-700 block">Enable Payment Method</span>
              <span className="text-xs text-gray-500">Allow users to pay using {selectedType}</span>
            </div>
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
            />
          </div>

          {isBank ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">🏦 Bank Transfer Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="bankName" className="block text-xs font-semibold text-gray-600 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    id="bankName"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    placeholder="e.g. Chase Bank"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="accountHolderName" className="block text-xs font-semibold text-gray-600 mb-1">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    id="accountHolderName"
                    name="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={handleChange}
                    placeholder="e.g. Acme Corp LLC"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="accountNumber" className="block text-xs font-semibold text-gray-600 mb-1">
                  Account / IBAN Number
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    id="accountNumber"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    placeholder="e.g. 1234567890"
                    className="w-full pl-3 pr-16 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handlePaste('accountNumber')}
                    className="absolute right-1.5 px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition cursor-pointer"
                  >
                    Paste
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                🪙 {selectedType} Crypto Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="walletAddress" className="block text-xs font-semibold text-gray-600 mb-1">
                    Wallet Address
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      id="walletAddress"
                      name="walletAddress"
                      value={formData.walletAddress}
                      onChange={handleChange}
                      placeholder="e.g. 0x1234...abcd or T..."
                      className="w-full pl-3 pr-16 py-2 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handlePaste('walletAddress')}
                      className="absolute right-1.5 px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition cursor-pointer"
                    >
                      Paste
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="network" className="block text-xs font-semibold text-gray-600 mb-1">
                    Network
                  </label>
                  <input
                    type="text"
                    id="network"
                    name="network"
                    value={formData.network}
                    onChange={handleChange}
                    placeholder="e.g. TRC20, ERC20, BTC"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-700 active:bg-blue-800 transition disabled:opacity-50 shadow-sm cursor-pointer"
            >
              {isSubmitting ? 'Saving Changes...' : `Save ${selectedType} Settings`}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}