'use client';

import { useState, useEffect, useCallback } from 'react';

interface BankDetails {
  bankName?: string;
  accountNumber?: string;
  accountHolderName?: string;
}

export interface Transaction {
  _id: string;
  reference?: string;
  type: 'deposit' | 'withdrawal' | 'DEPOSIT' | 'WITHDRAWAL';
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  paymentMethod: string;
  bankDetails?: BankDetails;
  walletAddress?: string;
  proofOfPayment?: string;
  createdAt: string;
}

interface DynamicPaymentSettings {
  bankName?: string;
  accountNumber?: string;
  accountHolderName?: string;
  walletAddress?: string;
  address?: string;
  network?: string;
}

interface ReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onProofUploaded?: (updatedTx: Transaction) => void;
}

const SUPPORTED_CRYPTOS = [
  { id: 'usdt', label: 'USDT (Tether)' },
  { id: 'btc', label: 'Bitcoin (BTC)' },
  { id: 'eth', label: 'Ethereum (ETH)' },
  { id: 'sol', label: 'Solana (SOL)' },
  { id: 'usdc', label: 'USD Coin (USDC)' },
];

export default function ReceiptModal({ transaction, onClose, onProofUploaded }: ReceiptModalProps) {
  if (!transaction) return null;

  const isDeposit = transaction.type?.toUpperCase() === 'DEPOSIT';
  const isPending = transaction.status?.toUpperCase() === 'PENDING';

  const methodUpper = transaction.paymentMethod?.toUpperCase() || '';
  const isBankTransfer = methodUpper === 'BANK_TRANSFER' || methodUpper === 'BANK';
  const isCrypto = !isBankTransfer;

  const [selectedCrypto, setSelectedCrypto] = useState<string>(
    transaction.paymentMethod && !isBankTransfer ? transaction.paymentMethod.toLowerCase() : 'usdt'
  );
  const [paymentSettings, setPaymentSettings] = useState<DynamicPaymentSettings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState<boolean>(false);

  const [copied, setCopied] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState(false);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(transaction.proofOfPayment || null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Fetch admin configured payment settings for selected payment method/crypto
  const fetchSettings = useCallback(async () => {
    if (!isDeposit) return;

    setLoadingSettings(true);
    const queryType = isCrypto ? selectedCrypto : transaction.paymentMethod;
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    try {
      const res = await fetch(`${API_BASE_URL}/api/transaction/payment-settings?type=${encodeURIComponent(queryType.toLowerCase())}`);
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setPaymentSettings(data.settings);
        } else if (data.walletAddress || data.address || data.bankName) {
          setPaymentSettings(data);
        } else {
          setPaymentSettings(null);
        }
      } else {
        setPaymentSettings(null);
      }
    } catch (err) {
      console.error('Failed to load payment settings:', err);
      setPaymentSettings(null);
    } finally {
      setLoadingSettings(false);
    }
  }, [isDeposit, isCrypto, selectedCrypto, transaction?.paymentMethod]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyAccount = (accountNumber: string) => {
    navigator.clipboard.writeText(accountNumber);
    setCopiedAcc(true);
    setTimeout(() => setCopiedAcc(false), 2000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    try {
      let processableFile = file;

      const isHeic =
        file.type === 'image/heic' ||
        file.type === 'image/heif' ||
        file.name.toLowerCase().endsWith('.heic') ||
        file.name.toLowerCase().endsWith('.heif');

      if (isHeic) {
        const heic2any = (await import('heic2any')).default;
        const convertedBlob = (await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.8,
        })) as Blob;

        processableFile = new File(
          [convertedBlob],
          file.name.replace(/\.(heic|HEIC|heif|HEIF)$/, '.jpg'),
          { type: 'image/jpeg' }
        );
      }

      if (processableFile.size > 5 * 1024 * 1024) {
        setUploadError('File size must be under 5MB');
        return;
      }

      setSelectedFile(processableFile);

      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(processableFile);
    } catch (err) {
      console.error('File processing error:', err);
      setUploadError('Could not process this image format. Please select another image.');
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUploadProof = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadError(null);

    try {
      const base64Image = await fileToBase64(selectedFile);

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE_URL}/api/transaction/${transaction._id}/upload-proof`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ proofOfPayment: base64Image }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to upload proof');
      }

      const data = await res.json();
      setUploadSuccess(true);
      setSelectedFile(null);
      if (onProofUploaded) onProofUploaded(data.transaction || data);
    } catch (err: any) {
      console.error('Upload Error:', err);
      setUploadError(err.message || 'Error uploading proof of payment.');
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadgeColor = (status: Transaction['status']) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const displayWalletAddress =
    paymentSettings?.walletAddress ||
    paymentSettings?.address ||
    transaction.walletAddress ||
    'N/A';

  const displayNetwork = paymentSettings?.network || '';

  const displayBankName =
    paymentSettings?.bankName || transaction.bankDetails?.bankName || 'N/A';
  const displayAccountHolder =
    paymentSettings?.accountHolderName || transaction.bankDetails?.accountHolderName || 'N/A';
  const displayAccountNumber =
    paymentSettings?.accountNumber || transaction.bankDetails?.accountNumber || 'N/A';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-gray-50 border-b p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl cursor-pointer"
          >
            ✕
          </button>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 mb-3 font-semibold text-lg">
            {isDeposit ? '↓' : '↑'}
          </div>
          <h2 className="text-xl font-bold text-gray-800">Transaction Receipt</h2>
          <p className="text-xs text-gray-500 mt-1">
            Ref: {transaction.reference || transaction._id}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-gray-700 text-sm">
          
          {/* Amount Display */}
          <div className="text-center py-2 border-b">
            <span className="text-xs uppercase text-gray-500 font-medium">Amount</span>
            <div className={`text-3xl font-extrabold ${isDeposit ? 'text-green-600' : 'text-red-600'}`}>
              {isDeposit ? '+' : '-'}${transaction.amount ? transaction.amount.toFixed(2) : '0.00'}
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Transaction Type</span>
              <span className="font-semibold uppercase">{transaction.type}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500">Status</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadgeColor(transaction.status)}`}>
                {transaction.status?.toUpperCase()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500">Payment Method</span>
              <span className="font-medium text-gray-800 uppercase">{transaction.paymentMethod}</span>
            </div>

            {/* Dynamic Crypto Payment Destination */}
            {isCrypto && isDeposit && (
              <div className="border-t pt-3 space-y-3">
                {/* Select Crypto Dropdown */}
                <div className="flex justify-between items-center">
                  <label htmlFor="crypto-select" className="text-gray-500 text-sm font-medium">
                    Select Crypto
                  </label>
                  <select
                    id="crypto-select"
                    value={selectedCrypto}
                    onChange={(e) => setSelectedCrypto(e.target.value)}
                    className="px-2.5 py-1 text-xs border border-gray-300 rounded-md bg-white font-medium text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                  >
                    {SUPPORTED_CRYPTOS.map((crypto) => (
                      <option key={crypto.id} value={crypto.id}>
                        {crypto.label}
                      </option>
                    ))}
                  </select>
                </div>

                {loadingSettings ? (
                  <div className="h-12 bg-gray-100 rounded animate-pulse" />
                ) : (
                  <div className="bg-gray-50 p-3 rounded-lg border space-y-2">
                    {displayNetwork && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-xs">Network</span>
                        <span className="font-semibold text-xs text-gray-800">{displayNetwork}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-gray-500 text-xs">Deposit Address</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-medium text-gray-800 bg-white border px-2 py-0.5 rounded select-all truncate max-w-[140px]">
                          {displayWalletAddress}
                        </span>
                        {displayWalletAddress !== 'N/A' && (
                          <button
                            type="button"
                            onClick={() => handleCopy(displayWalletAddress)}
                            className="px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 border border-blue-200 rounded transition cursor-pointer"
                          >
                            {copied ? 'Copied!' : 'Copy'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Dynamic Bank Transfer Destination */}
            {isBankTransfer && isDeposit && (
              <div className="border-t pt-3 space-y-2">
                {loadingSettings ? (
                  <div className="h-12 bg-gray-100 rounded animate-pulse" />
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">Account Holder</span>
                      <span className="font-medium text-gray-800">{displayAccountHolder}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">Bank Name</span>
                      <span className="font-medium text-gray-800">{displayBankName}</span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-gray-500 text-sm">Account Number</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium text-gray-800 bg-gray-100 px-2 py-1 rounded select-all">
                          {displayAccountNumber}
                        </span>
                        {displayAccountNumber !== 'N/A' && (
                          <button
                            type="button"
                            onClick={() => handleCopyAccount(displayAccountNumber)}
                            className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 rounded transition cursor-pointer"
                          >
                            {copiedAcc ? 'Copied!' : 'Copy'}
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="flex justify-between items-center border-t pt-3">
              <span className="text-gray-500">Date & Time</span>
              <span className="font-medium text-gray-800">
                {transaction.createdAt ? new Date(transaction.createdAt).toLocaleString() : 'N/A'}
              </span>
            </div>

            {/* Proof of Payment Section */}
            {isDeposit && (
              <div className="mt-4 pt-4 border-t space-y-3">
                <p className="text-xs font-bold text-gray-700 uppercase">Proof of Payment</p>

                {uploadError && (
                  <div className="p-2 bg-red-100 text-red-700 text-xs rounded border border-red-200">
                    {uploadError}
                  </div>
                )}

                {uploadSuccess && (
                  <div className="p-2 bg-green-100 text-green-700 text-xs rounded border border-green-200">
                    Proof submitted successfully! Awaiting admin review.
                  </div>
                )}

                {(previewUrl || transaction.proofOfPayment) ? (
                  <div className="space-y-3">
                    <div className="relative rounded-lg border overflow-hidden bg-gray-50">
                      <img
                        src={previewUrl || transaction.proofOfPayment}
                        alt="Proof of Payment"
                        className="w-full max-h-48 object-contain py-2"
                      />
                    </div>

                    {selectedFile && !uploadSuccess && (
                      <button
                        type="button"
                        onClick={handleUploadProof}
                        disabled={uploading}
                        className="w-full py-2 bg-blue-600 text-white rounded-md text-xs font-semibold hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition shadow-sm cursor-pointer"
                      >
                        {uploading ? 'Uploading Receipt...' : 'Submit Proof of Payment'}
                      </button>
                    )}

                    {isPending && !uploadSuccess && (
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrl(null);
                          setSelectedFile(null);
                        }}
                        className="text-xs text-red-600 hover:underline block cursor-pointer"
                      >
                        Change receipt image
                      </button>
                    )}
                  </div>
                ) : isPending ? (
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                      onChange={handleFileChange}
                      className="block w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border rounded-md p-1"
                    />
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No receipt attached.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 border-t p-4 flex gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium transition text-sm cursor-pointer"
          >
            Print Receipt
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-gray-800 text-white rounded-md hover:bg-gray-900 font-medium transition text-sm cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}