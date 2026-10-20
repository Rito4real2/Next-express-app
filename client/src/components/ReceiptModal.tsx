'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import '../../lib/locales/i18n';

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
  isPinVerified?: boolean; // <-- Added PIN verification flag
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
  onPinValidated?: (updatedTx: Transaction) => void; // <-- Callback when PIN is successfully verified
}

export default function ReceiptModal({ transaction, onClose, onProofUploaded, onPinValidated }: ReceiptModalProps) {
  const { t, i18n } = useTranslation();

  const isDeposit = transaction?.type?.toUpperCase() === 'DEPOSIT';
  const isWithdrawal = transaction?.type?.toUpperCase() === 'WITHDRAWAL';
  const isPending = transaction?.status?.toUpperCase() === 'PENDING';

  const methodUpper = transaction?.paymentMethod?.toUpperCase() || '';
  const isBankTransfer = methodUpper === 'BANK_TRANSFER' || methodUpper === 'BANK';
  const isCrypto = !isBankTransfer;

  const [paymentSettings, setPaymentSettings] = useState<DynamicPaymentSettings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState<boolean>(false);

  const [copied, setCopied] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState(false);

  // File Upload State (Deposits)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // PIN Validation State (Withdrawals)
  const [withdrawalPin, setWithdrawalPin] = useState('');
  const [validatingPin, setValidatingPin] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [pinSuccess, setPinSuccess] = useState<string | null>(null);

  // Keep preview & PIN states aligned with incoming transaction prop
  useEffect(() => {
    if (transaction) {
      setPreviewUrl(transaction.proofOfPayment || null);
      setSelectedFile(null);
      setUploadError(null);
      setUploadSuccess(false);
      setWithdrawalPin('');
      setPinError(null);
      setPinSuccess(null);
    }
  }, [transaction]);

  // Fetch admin-configured payment settings (Deposits only)
  const fetchSettings = useCallback(async () => {
    if (!isDeposit || !transaction?.paymentMethod) return;

    setLoadingSettings(true);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    try {
      const queryMethod = encodeURIComponent(transaction.paymentMethod.trim().toUpperCase());

      const res = await fetch(`${API_BASE_URL}/api/transaction/payment-settings?type=${queryMethod}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (res.ok) {
        const responseData = await res.json();
        if (responseData.settings) {
          setPaymentSettings(responseData.settings);
        }
      }
    } catch (err) {
      console.error('Failed to load payment settings:', err);
    } finally {
      setLoadingSettings(false);
    }
  }, [isDeposit, transaction?.paymentMethod]);

  useEffect(() => {
    if (transaction) {
      fetchSettings();
    }
  }, [fetchSettings, transaction]);

  if (!transaction) return null;

  const handleCopy = (address: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyAccount = (accountNumber: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(accountNumber);
      setCopiedAcc(true);
      setTimeout(() => setCopiedAcc(false), 2000);
    }
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

      if (isHeic && typeof window !== 'undefined') {
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
        setUploadError(t('receipt.errors.file_size_exceeded', 'File size must be under 5MB'));
        return;
      }

      setSelectedFile(processableFile);

      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(processableFile);
    } catch (err) {
      console.error('File processing error:', err);
      setUploadError(
        t('receipt.errors.file_processing', 'Could not process this image format. Please select another image.')
      );
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
        throw new Error(errData.message || t('receipt.errors.upload_failed', 'Failed to upload proof'));
      }

      const data = await res.json();
      setUploadSuccess(true);
      setSelectedFile(null);
      if (onProofUploaded) onProofUploaded(data.transaction || data);
    } catch (err: any) {
      console.error('Upload Error:', err);
      setUploadError(err.message || t('receipt.errors.upload_generic', 'Error uploading proof of payment.'));
    } finally {
      setUploading(false);
    }
  };

  // Handle Delayed PIN Validation for Withdrawals
  const handleValidatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawalPin.trim()) return;

    setValidatingPin(true);
    setPinError(null);
    setPinSuccess(null);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    try {
      const res = await fetch(`${API_BASE_URL}/api/transaction/${transaction._id}/validate-pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ pin: withdrawalPin.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to validate PIN');
      }

      setPinSuccess('PIN validated successfully! Request is pending final admin approval.');
      setWithdrawalPin('');
      if (onPinValidated) onPinValidated(data.transaction || data);
    } catch (err: any) {
      console.error('PIN Validation Error:', err);
      setPinError(err.message || 'Invalid withdrawal PIN. Please try again.');
    } finally {
      setValidatingPin(false);
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

  const displayWalletAddress = isDeposit
    ? paymentSettings?.walletAddress || paymentSettings?.address || transaction.walletAddress || t('common.not_applicable', 'N/A')
    : transaction.walletAddress || t('common.not_applicable', 'N/A');

  const displayNetwork = isDeposit ? paymentSettings?.network || '' : '';

  const displayBankName = isDeposit
    ? paymentSettings?.bankName || transaction.bankDetails?.bankName || t('common.not_applicable', 'N/A')
    : transaction.bankDetails?.bankName || t('common.not_applicable', 'N/A');

  const displayAccountHolder = isDeposit
    ? paymentSettings?.accountHolderName || transaction.bankDetails?.accountHolderName || t('common.not_applicable', 'N/A')
    : transaction.bankDetails?.accountHolderName || t('common.not_applicable', 'N/A');

  const displayAccountNumber = isDeposit
    ? paymentSettings?.accountNumber || transaction.bankDetails?.accountNumber || t('common.not_applicable', 'N/A')
    : transaction.bankDetails?.accountNumber || t('common.not_applicable', 'N/A');

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
          <h2 className="text-xl font-bold font-mono text-gray-800">{t('receipt.title', 'Transaction Receipt')}</h2>
          <p className="text-xs text-gray-500 mt-1 font-mono">
            {t('receipt.reference', 'Ref')}: {transaction.reference || transaction._id}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-gray-700 text-sm">
          
          {/* Amount Display */}
          <div className="text-center py-2 border-b">
            <span className="text-xs uppercase text-gray-500 font-medium font-mono">{t('receipt.amount', 'Amount')}</span>
            <div className={`text-3xl font-extrabold font-mono ${isDeposit ? 'text-green-600' : 'text-red-600'}`}>
              {isDeposit ? '+' : '-'}${transaction.amount ? transaction.amount.toFixed(2) : '0.00'}
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-mono">{t('receipt.type', 'Transaction Type')}</span>
              <span className="font-semibold uppercase">
                {t(`receipt.types.${transaction.type.toLowerCase()}`, transaction.type)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-mono">{t('receipt.status', 'Status')}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono border ${getStatusBadgeColor(transaction.status)}`}>
                {t(`receipt.statuses.${transaction.status.toLowerCase()}`, transaction.status?.toUpperCase())}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-mono">{t('receipt.payment_method', 'Payment Method')}</span>
              <span className="font-medium font-mono text-gray-800 uppercase">
                {t(`receipt.methods.${transaction.paymentMethod.toLowerCase()}`, transaction.paymentMethod)}
              </span>
            </div>

            {/* Crypto Destination Details */}
            {isCrypto && (
              <div className="border-t pt-3 space-y-2">
                <p className="text-xs font-bold font-mono text-gray-700 uppercase">
                  {isDeposit ? t('receipt.crypto_deposit_details', 'Crypto Deposit Details') : t('receipt.crypto_withdrawal_details', 'Crypto Destination Details')}
                </p>
                {isDeposit && loadingSettings ? (
                  <div className="h-10 bg-gray-100 rounded animate-pulse" />
                ) : (
                  <>
                    {displayNetwork && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm font-mono">{t('receipt.network', 'Network')}</span>
                        <span className="font-medium font-mono text-gray-800">{displayNetwork}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-gray-500 text-sm font-mono">
                        {isDeposit ? t('receipt.deposit_wallet', 'Deposit Wallet') : t('receipt.wallet_address', 'Wallet Address')}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-medium text-gray-800 bg-gray-100 px-2 py-1 rounded select-all truncate max-w-[150px]">
                          {displayWalletAddress}
                        </span>
                        {displayWalletAddress !== t('common.not_applicable', 'N/A') && (
                          <button
                            type="button"
                            onClick={() => handleCopy(displayWalletAddress)}
                            className="px-2 py-1 text-xs font-medium font-mono text-gray-700 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 rounded transition cursor-pointer"
                          >
                            {copied ? t('common.copied', 'Copied!') : t('common.copy', 'Copy')}
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Bank Transfer Destination Details */}
            {isBankTransfer && (
              <div className="border-t pt-3 space-y-2">
                <p className="text-xs font-bold font-mono text-gray-700 uppercase">
                  {isDeposit ? t('receipt.bank_deposit_details', 'Bank Deposit Details') : t('receipt.bank_withdrawal_details', 'Destination Bank Account')}
                </p>
                {isDeposit && loadingSettings ? (
                  <div className="h-12 bg-gray-100 rounded animate-pulse" />
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm font-mono">{t('receipt.account_holder', 'Account Holder')}</span>
                      <span className="font-medium font-mono text-gray-800">{displayAccountHolder}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm font-mono">{t('receipt.bank_name', 'Bank Name')}</span>
                      <span className="font-medium font-mono text-gray-800">{displayBankName}</span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-gray-500 text-sm font-mono">{t('receipt.account_number', 'Account Number')}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium text-gray-800 bg-gray-100 px-2 py-1 rounded select-all">
                          {displayAccountNumber}
                        </span>
                        {displayAccountNumber !== t('common.not_applicable', 'N/A') && (
                          <button
                            type="button"
                            onClick={() => handleCopyAccount(displayAccountNumber)}
                            className="px-2 py-1 text-xs font-medium font-mono text-gray-700 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 rounded transition cursor-pointer"
                          >
                            {copiedAcc ? t('common.copied', 'Copied!') : t('common.copy', 'Copy')}
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="flex justify-between items-center border-t pt-3">
              <span className="text-gray-500 font-mono">{t('receipt.date_time', 'Date & Time')}</span>
              <span className="font-medium font-mono text-gray-800">
                {transaction.createdAt
                  ? new Date(transaction.createdAt).toLocaleString(i18n.language)
                  : t('common.not_applicable', 'N/A')}
              </span>
            </div>

            {/* Proof of Payment Section (Deposits Only) */}
            {isDeposit && (
              <div className="mt-4 pt-4 border-t space-y-3">
                <p className="text-xs font-bold font-mono text-gray-700 uppercase">
                  {t('receipt.proof_of_payment', 'Proof of Payment')}
                </p>

                {uploadError && (
                  <div className="p-2 bg-red-100 text-red-700 text-xs font-mono rounded border border-red-200">
                    {uploadError}
                  </div>
                )}

                {uploadSuccess && (
                  <div className="p-2 bg-green-100 text-green-700 text-xs font-mono rounded border border-green-200">
                    {t('receipt.upload_success', 'Proof submitted successfully! Awaiting admin review.')}
                  </div>
                )}

                {(previewUrl || transaction.proofOfPayment) ? (
                  <div className="space-y-3">
                    <div className="relative rounded-lg border overflow-hidden bg-gray-50">
                      <img
                        src={previewUrl || transaction.proofOfPayment}
                        alt={t('receipt.proof_of_payment', 'Proof of Payment')}
                        className="w-full max-h-48 object-contain py-2"
                      />
                    </div>

                    {selectedFile && !uploadSuccess && (
                      <button
                        type="button"
                        onClick={handleUploadProof}
                        disabled={uploading}
                        className="w-full py-2 bg-blue-600 text-white rounded-md text-xs font-semibold font-mono hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition shadow-sm cursor-pointer"
                      >
                        {uploading
                          ? t('receipt.uploading', 'Uploading Receipt...')
                          : t('receipt.submit_proof', 'Submit Proof of Payment')}
                      </button>
                    )}

                    {isPending && !uploadSuccess && (
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrl(null);
                          setSelectedFile(null);
                        }}
                        className="text-xs text-red-600 font-mono hover:underline block cursor-pointer"
                      >
                        {t('receipt.change_receipt', 'Change receipt image')}
                      </button>
                    )}
                  </div>
                ) : isPending ? (
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                      onChange={handleFileChange}
                      className="block w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold font-mono file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border rounded-md p-1"
                    />
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">
                    {t('receipt.no_receipt_attached', 'No receipt attached.')}
                  </p>
                )}
              </div>
            )}

            {/* PIN Verification Section (Withdrawals, Pending, & !isPinVerified) */}
            {isWithdrawal && isPending && !transaction.isPinVerified && (
              <div className="mt-4 pt-4 border-t space-y-3 font-mono">
                <p className="text-xs font-bold text-red-700 uppercase">
                  {t('receipt.security_pin_required', 'Security PIN Authorization Required')}
                </p>

                {pinError && (
                  <div className="p-2 bg-red-100 text-red-700 text-xs rounded border border-red-200">
                    {pinError}
                  </div>
                )}

                {pinSuccess && (
                  <div className="p-2 bg-green-100 text-green-700 text-xs rounded border border-green-200">
                    {pinSuccess}
                  </div>
                )}

                {!pinSuccess && (
                  <form onSubmit={handleValidatePin} className="space-y-3">
                    <div>
                      <label className="block text-[11px] text-gray-600 mb-1">
                        {t('receipt.enter_withdrawal_pin', 'Enter 6-digit withdrawal PIN assigned by admin')}
                      </label>
                      <input
                        type="password"
                        maxLength={6}
                        value={withdrawalPin}
                        onChange={(e) => setWithdrawalPin(e.target.value)}
                        placeholder="••••••"
                        className="w-full p-2 border rounded text-center tracking-widest font-bold text-sm bg-gray-50 focus:bg-white text-gray-800"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={validatingPin}
                      className="w-full py-2 bg-red-900 text-white rounded-md text-xs font-semibold hover:bg-red-800 active:bg-red-950 disabled:opacity-50 transition shadow-sm cursor-pointer"
                    >
                      {validatingPin
                        ? t('receipt.validating_pin', 'Validating PIN...')
                        : t('receipt.submit_pin', 'Validate & Authorize Withdrawal')}
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 border-t p-4 flex gap-3">
          <button
            type="button"
            onClick={() => typeof window !== 'undefined' && window.print()}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 font-mono hover:bg-gray-100 font-medium transition text-sm cursor-pointer"
          >
            {t('receipt.print', 'Print Receipt')}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-gray-800 text-white rounded-md hover:bg-gray-900 font-medium font-mono transition text-sm cursor-pointer"
          >
            {t('receipt.close', 'Close')}
          </button>
        </div>

      </div>
    </div>
  );
}