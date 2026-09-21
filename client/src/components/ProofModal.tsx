// Simple Image Modal Component for Admin Preview
export default function ProofModal({ imageUrl, onClose }: { imageUrl: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative bg-white p-4 rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold text-xl px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
        >
          ✕
        </button>
        <h3 className="text-lg font-bold text-gray-800 mb-4 self-start">Proof of Payment</h3>
        <div className="overflow-auto w-full max-h-[70vh] flex justify-center bg-gray-50 rounded border p-2">
          <img src={imageUrl} alt="Proof of Payment" className="object-contain max-h-[65vh] rounded" />
        </div>
        <div className="mt-4 flex justify-end w-full">
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition"
          >
            Open Full Size
          </a>
        </div>
      </div>
    </div>
  );
}