'use client';
import { useState } from 'react';

interface Plan {
  _id?: string;
  id?: string;
  name: string;
  durationDays: number;
  profitPercentage: number;
  minInvestment: number;
  maxInvestment: number;
}

export default function BuyPlanCard({ plan }: { plan: Plan }) {
    console.log('PLAN OBJECT RECEIVED IN COMPONENT:', plan);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Resolve plan ID from any possible property name
    const resolvedPlanId = plan._id || plan.id;

    console.log('Resolved Plan ID:', resolvedPlanId);

    if (!resolvedPlanId) {
      setMessage({ text: 'Error: Plan ID is missing from this card.', isError: true });
      setLoading(false);
      return;
    }

    const numericAmount = Number(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      setMessage({ text: 'Please enter a valid investment amount.', isError: true });
      setLoading(false);
      return;
    }

    if (numericAmount < plan.minInvestment || numericAmount > plan.maxInvestment) {
      setMessage({ 
        text: `Amount must be between $${plan.minInvestment} and $${plan.maxInvestment}`, 
        isError: true 
      });
      setLoading(false);
      return;
    }

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    try {
      const res = await fetch(`${API_BASE_URL}/api/investment/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ planId: resolvedPlanId, amount: numericAmount }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to purchase plan.');
      }

      setMessage({ text: 'Plan activated successfully!', isError: false });
      setAmount('');
    } catch (err: any) {
      setMessage({ text: err.message || 'An unexpected error occurred.', isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-xl p-6 shadow-md space-y-4 font-mono">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
        <span className="px-2.5 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
          +{plan.profitPercentage}% Return
        </span>
      </div>

      <div className="space-y-1 text-xs text-gray-600">
        <p>Duration: {plan.durationDays} Days</p>
        <p>Min Invest: ${plan.minInvestment}</p>
        <p>Max Invest: ${plan.maxInvestment}</p>
      </div>

      {message && (
        <p
          className={`text-xs font-semibold text-center p-2 rounded border ${
            message.isError
              ? 'bg-red-50 text-red-700 border-red-200'
              : 'bg-green-50 text-green-700 border-green-200'
          }`}
        >
          {message.text}
        </p>
      )}

      <form onSubmit={handleSubscribe} className="space-y-3">
        <input
          type="number"
          placeholder={`Enter amount ($${plan.minInvestment}+)`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-black outline-none"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-black text-white rounded text-xs font-bold hover:bg-gray-800 transition cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Buy Plan'}
        </button>
      </form>
    </div>
  );
}