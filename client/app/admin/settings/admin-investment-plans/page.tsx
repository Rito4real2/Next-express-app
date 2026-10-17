'use client';

import { useState } from 'react';

export default function AdminInvestmentPlanForm({ onPlanCreated }: { onPlanCreated?: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    durationDays: 7,
    minInvestment: 500,
    maxInvestment: 5000,
    profitType: 'percentage',
    profitPercentage: 15,
    fixedProfitAmount: 100,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['durationDays', 'minInvestment', 'maxInvestment', 'profitPercentage', 'fixedProfitAmount'].includes(name) 
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http:localhost:3000'
      const res = await fetch(`${backendUrl}/api/investments/admin/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create plan template.');
      }

      setSuccessMsg('Investment plan template created successfully!');
      setFormData({
        name: '',
        durationDays: 30,
        minInvestment: 50,
        maxInvestment: 5000,
        profitType: 'percentage',
        profitPercentage: 15,
        fixedProfitAmount: 100,
      });

      if (onPlanCreated) onPlanCreated();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border shadow-sm space-y-4 font-mono">
      <h3 className="text-lg font-bold text-gray-900">Create Investment Plan Template</h3>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-xs">
          {successMsg}
        </div>
      )}

      {/* Basic Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Plan Name</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required
            placeholder="e.g. Gold Tier Plan" 
            className="w-full border rounded-lg p-2 text-sm bg-gray-50 focus:bg-white transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Duration (Days)</label>
          <input 
            type="number" 
            name="durationDays" 
            value={formData.durationDays} 
            onChange={handleChange} 
            required
            className="w-full border rounded-lg p-2 text-sm bg-gray-50 focus:bg-white transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Min Investment ($)</label>
          <input 
            type="number" 
            name="minInvestment" 
            value={formData.minInvestment} 
            onChange={handleChange} 
            required
            className="w-full border rounded-lg p-2 text-sm bg-gray-50 focus:bg-white transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Max Investment ($)</label>
          <input 
            type="number" 
            name="maxInvestment" 
            value={formData.maxInvestment} 
            onChange={handleChange} 
            required
            className="w-full border rounded-lg p-2 text-sm bg-gray-50 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Profit Rule Configuration Section */}
      <div className="border-t pt-4 space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Profit Rule Type</label>
          <select 
            name="profitType" 
            value={formData.profitType} 
            onChange={handleChange} 
            className="w-full border rounded-lg p-2 text-sm bg-white"
          >
            <option value="percentage">Percentage Return (%)</option>
            <option value="fixed">Fixed Profit Return ($)</option>
          </select>
        </div>

        {formData.profitType === 'percentage' ? (
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Profit Percentage (%)</label>
            <input 
              type="number" 
              step="0.1" 
              name="profitPercentage" 
              value={formData.profitPercentage} 
              onChange={handleChange} 
              required
              placeholder="e.g. 15 for 15%" 
              className="w-full border rounded-lg p-2 text-sm bg-gray-50 focus:bg-white transition-colors"
            />
            <p className="text-[10px] text-gray-400 mt-1">Target profit scales automatically based on user's invested amount.</p>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Fixed Profit Amount ($)</label>
            <input 
              type="number" 
              step="0.01" 
              name="fixedProfitAmount" 
              value={formData.fixedProfitAmount} 
              onChange={handleChange} 
              required
              placeholder="e.g. 100" 
              className="w-full border rounded-lg p-2 text-sm bg-gray-50 focus:bg-white transition-colors"
            />
            <p className="text-[10px] text-gray-400 mt-1">Users receive this exact flat profit amount upon plan maturity.</p>
          </div>
        )}
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-black text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        {loading ? 'Creating Plan...' : 'Create Investment Plan'}
      </button>
    </form>
  );
}