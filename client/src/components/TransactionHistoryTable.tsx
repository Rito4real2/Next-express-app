'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReceiptModal, { Transaction } from '@/components/ReceiptModal';
import '@/public/i18n';

interface Props {
  transactions?: Transaction[];
}

export default function TransactionHistoryTable({ transactions = [] }: Props) {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const { t, i18n } = useTranslation();

  // Safely check array length
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 border border-dashed rounded-lg">
        {t('transactions.no_transactions', 'No transactions found yet.')}
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-gray-600 uppercase text-xs">
              <th className="p-3">{t('transactions.type', 'Type')}</th>
              <th className="p-3">{t('transactions.amount', 'Amount')}</th>
              <th className="p-3">{t('transactions.method', 'Method')}</th>
              <th className="p-3">{t('transactions.status', 'Status')}</th>
              <th className="p-3">{t('transactions.date', 'Date')}</th>
              <th className="p-3 text-right">{t('transactions.receipt', 'Receipt')}</th>
            </tr>
          </thead>
          <tbody className="divide-y text-gray-700">
            {transactions.map((tx) => (
              <tr key={tx._id} className="hover:bg-gray-50">
                <td className="p-3 font-semibold">
                  <span className={tx.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'}>
                    {t(`transactions.types.${tx.type.toLowerCase()}`, tx.type)}
                  </span>
                </td>
                <td className="p-3 font-bold">
                  ${typeof tx.amount === 'number' ? tx.amount.toFixed(2) : tx.amount}
                </td>
                <td className="p-3">{tx.paymentMethod || t('common.not_applicable', 'N/A')}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      tx.status === 'APPROVED' || tx.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : tx.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {t(`transactions.statuses.${tx.status.toLowerCase()}`, tx.status)}
                  </span>
                </td>
                <td className="p-3 text-gray-500">
                  {tx.createdAt 
                    ? new Date(tx.createdAt).toLocaleDateString(i18n.language) 
                    : t('common.not_applicable', 'N/A')}
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => setSelectedTx(tx)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded border text-xs font-medium transition"
                  >
                    {t('transactions.view', 'View')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ReceiptModal transaction={selectedTx} onClose={() => setSelectedTx(null)} />
    </>
  );
}