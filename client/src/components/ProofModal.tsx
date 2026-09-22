'use client';

import { useTranslation } from 'react-i18next';
import '@/public/i18n';

interface ProofModalProps {
  imageUrl: string;
  onClose: () => void;
}

export default function ProofModal({ imageUrl, onClose }: ProofModalProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative bg-white p-4 rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col items-center">
        <button
          onClick={onClose}
          aria-label={t('common.close', 'Close')}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold text-xl px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 cursor-pointer"
        >
          ✕
        </button>
        <h3 className="text-lg font-bold text-gray-800 mb-4 self-start">
          {t('proof_modal.title', 'Proof of Payment')}
        </h3>
        <div className="overflow-auto w-full max-h-[70vh] flex justify-center bg-gray-50 rounded border p-2">
          <img
            src={imageUrl}
            alt={t('proof_modal.title', 'Proof of Payment')}
            className="object-contain max-h-[65vh] rounded"
          />
        </div>
        <div className="mt-4 flex justify-end w-full">
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition"
          >
            {t('proof_modal.open_full_size', 'Open Full Size')}
          </a>
        </div>
      </div>
    </div>
  );
}