'use client';

import { useState } from 'react';
import heic2any from 'heic2any';

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

interface ReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onProofUploaded?: (updatedTx: Transaction) => void;
}

export default function ReceiptModal({ transaction, onClose, onProofUploaded }: ReceiptModalProps) {
  if (!transaction) return null;

  const isDeposit = transaction.type.toUpperCase() === 'DEPOSIT';
  const isPending = transaction.status.toUpperCase() === 'PENDING';
  const isCrypto =
    transaction.paymentMethod.toLowerCase() === 'crypto' ||
    transaction.paymentMethod.toLowerCase() === 'cryptocurrency';
  const isBankTransfer =
    transaction.paymentMethod.toLowerCase() === 'bank_transfer' ||
    transaction.paymentMethod.toLowerCase() === 'bank';

  const [copied, setCopied] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState(false);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(transaction.proofOfPayment || null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

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

    // Check if the file is HEIC/HEIF format (typical for iPhone photos)
    const isHeic =
      file.type === 'image/heic' ||
      file.type === 'image/heif' ||
      file.name.toLowerCase().endsWith('.heic') ||
      file.name.toLowerCase().endsWith('.heif');

    if (isHeic) {
      // Convert HEIC to JPEG blob
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

    // Enforce 5MB limit on the converted file
    if (processableFile.size > 5 * 1024 * 1024) {
      setUploadError('File size must be under 5MB');
      return;
    }

    setSelectedFile(processableFile);

    // Create local preview URL
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(processableFile);
  } catch (err) {
    console.error('File processing error:', err);
    setUploadError('Could not process this image format. Please select another image.');
  }
};

  // Helper to convert file to base64 string
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
        credentials: 'include', // Send HttpOnly auth cookie to backend
        body: JSON.stringify({ proofOfPayment: base64Image }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to upload proof');
      }

      const data = await res.json();
      setUploadSuccess(true);
      setSelectedFile(null); // Clear file selection after successful upload
      if (onProofUploaded) onProofUploaded(data.transaction || data);
    } catch (err: any) {
      console.error('Upload Error:', err);
      setUploadError(err.message || 'Error uploading proof of payment.');
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadgeColor = (status: Transaction['status']) => {
    switch (status.toUpperCase()) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-gray-50 border-b p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl"
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
              {isDeposit ? '+' : '-'}${transaction.amount.toFixed(2)}
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
                {transaction.status.toUpperCase()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500">Payment Method</span>
              <span className="font-medium text-gray-800">{transaction.paymentMethod}</span>
            </div>

            {/* Admin Crypto Wallet Destination */}
            {isCrypto && isDeposit && (
              <div className="flex justify-between items-center gap-4 py-2 border-t pt-3">
                <span className="text-gray-500 text-sm">Deposit Wallet</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-medium text-gray-800 bg-gray-100 px-2 py-1 rounded select-all truncate max-w-[150px]">
                    136tj818eAfmaPsVpcYx9r1kfMFcKhPdW6
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy('136tj818eAfmaPsVpcYx9r1kfMFcKhPdW6')}
                    className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 rounded transition"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}

            {/* Admin Bank Transfer Destination */}
            {isBankTransfer && isDeposit && (
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Account Holder</span>
                  <span className="font-medium text-gray-800">Investment Global</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Bank Name</span>
                  <span className="font-medium text-gray-800">Global Investment Bank</span>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <span className="text-gray-500 text-sm">Account Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium text-gray-800 bg-gray-100 px-2 py-1 rounded select-all">
                      9123456789
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyAccount('9123456789')}
                      className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 rounded transition"
                    >
                      {copiedAcc ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center border-t pt-3">
              <span className="text-gray-500">Date & Time</span>
              <span className="font-medium text-gray-800">
                {new Date(transaction.createdAt).toLocaleString()}
              </span>
            </div>

            {/* Proof of Payment Upload / Display Section */}
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

                {/* Show Image Preview if Uploaded or Provided */}
                {(previewUrl || transaction.proofOfPayment) ? (
                  <div className="space-y-3">
                    <div className="relative rounded-lg border overflow-hidden bg-gray-50">
                      <img
                        src={previewUrl || transaction.proofOfPayment}
                        alt="Proof of Payment"
                        className="w-full max-h-48 object-contain py-2"
                      />
                    </div>

                    {/* Submit button for newly selected local image */}
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

                    {/* Button to change or clear the image */}
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
                  /* Form to select file if pending */
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