'use client';

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
  status: 'pending' | 'approved' | 'rejected' | 'PENDING' | 'APPROVED' | 'REJECTED';
  paymentMethod: string;
  bankDetails?: BankDetails;
  walletAddress?: string;
  createdAt: string;
}

interface ReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export default function ReceiptModal({ transaction, onClose }: ReceiptModalProps) {
  if (!transaction) return null;

  const isDeposit = transaction.type.toUpperCase() === 'DEPOSIT';
  const statusUpper = transaction.status.toUpperCase();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border overflow-hidden">
        
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
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(statusUpper)}`}>
                {statusUpper}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500">Payment Method</span>
              <span className="font-medium text-gray-800">{transaction.paymentMethod}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500">Date & Time</span>
              <span className="font-medium text-gray-800">
                {new Date(transaction.createdAt).toLocaleString()}
              </span>
            </div>

            {/* Dynamic Details for Bank Transfers */}
            {transaction.bankDetails && (
              <div className="mt-4 pt-3 border-t space-y-2 bg-gray-50 p-3 rounded">
                <p className="text-xs font-bold text-gray-500 uppercase">Bank Details</p>
                {transaction.bankDetails.bankName && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bank Name:</span>
                    <span className="font-medium text-gray-800">{transaction.bankDetails.bankName}</span>
                  </div>
                )}
                {transaction.bankDetails.accountHolderName && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Account Holder:</span>
                    <span className="font-medium text-gray-800">{transaction.bankDetails.accountHolderName}</span>
                  </div>
                )}
                {transaction.bankDetails.accountNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Account Number:</span>
                    <span className="font-medium text-gray-800">****{transaction.bankDetails.accountNumber.slice(-4)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Dynamic Details for Crypto */}
            {transaction.walletAddress && (
              <div className="mt-4 pt-3 border-t bg-gray-50 p-3 rounded">
                <p className="text-xs font-bold text-gray-500 uppercase">Wallet Address</p>
                <p className="font-mono text-xs text-gray-800 break-all mt-1">{transaction.walletAddress}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 border-t p-4 flex gap-3">
          <button
            onClick={() => window.print()}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium transition text-sm"
          >
            Print Receipt
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-gray-800 text-white rounded-md hover:bg-gray-900 font-medium transition text-sm"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}