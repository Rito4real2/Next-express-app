'use client';

import { useState, useEffect } from 'react';

interface InvestmentPlan {
  _id: string;
  name: string;
  durationDays: number;
  minInvestment: number;
  maxInvestment: number;
  profitType: 'percentage' | 'fixed';
  profitPercentage?: number;
  fixedProfitAmount?: number;
}

export default function AdminInvestmentPlansManager() {
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Edit mode tracking
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    durationDays: 7,
    minInvestment: 500,
    maxInvestment: 5000,
    profitType: 'percentage' as 'percentage' | 'fixed',
    profitPercentage: 15,
    fixedProfitAmount: 100,
  });

  // Fetch all plans on mount
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/api/investments/admin/plans`, {
        credentials: 'include',
        cache: 'no-store'
      });

      if (!res.ok) throw new Error('Failed to fetch investment plans.');
      const data = await res.json();
      setPlans(Array.isArray(data) ? data : data.plans || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

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
    setActionLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const url = editingPlanId 
        ? `${backendUrl}/api/investments/admin/plans/${editingPlanId}`
        : `${backendUrl}/api/investments/admin/plans`;
      
      const method = editingPlanId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save investment plan.');
      }

      setSuccessMsg(editingPlanId ? 'Investment plan updated successfully!' : 'Investment plan created successfully!');
      resetForm();
      fetchPlans();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditClick = (plan: InvestmentPlan) => {
    setEditingPlanId(plan._id);
    setFormData({
      name: plan.name,
      durationDays: plan.durationDays,
      minInvestment: plan.minInvestment,
      maxInvestment: plan.maxInvestment,
      profitType: plan.profitType || 'percentage',
      profitPercentage: plan.profitPercentage || 15,
      fixedProfitAmount: plan.fixedProfitAmount || 100,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this investment plan?')) return;

    try {
      setActionLoading(true);
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/api/investments/admin/plans/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Failed to delete plan.');

      setSuccessMsg('Investment plan deleted successfully!');
      fetchPlans();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const resetForm = () => {
    setEditingPlanId(null);
    setFormData({
      name: '',
      durationDays: 30,
      minInvestment: 50,
      maxInvestment: 5000,
      profitType: 'percentage',
      profitPercentage: 15,
      fixedProfitAmount: 100,
    });
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Form Section */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg font-bold text-gray-900">
            {editingPlanId ? 'Edit Investment Plan' : 'Create Investment Plan Template'}
          </h3>
          {editingPlanId && (
            <button 
              type="button" 
              onClick={resetForm}
              className="text-xs text-gray-500 hover:text-black underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
        
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
                className="w-full border rounded-lg p-2 text-sm bg-gray-50 focus:bg-white transition-colors"
              />
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
                className="w-full border rounded-lg p-2 text-sm bg-gray-50 focus:bg-white transition-colors"
              />
            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={actionLoading}
          className="w-full bg-black text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {actionLoading ? 'Saving...' : editingPlanId ? 'Update Investment Plan' : 'Create Investment Plan'}
        </button>
      </form>

      {/* Plans List Section */}
      <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Existing Investment Plans</h3>

        {loading ? (
          <p className="text-xs text-gray-500 animate-pulse">Loading plans...</p>
        ) : plans.length === 0 ? (
          <p className="text-xs text-gray-500">No investment plans created yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map((plan) => (
              <div key={plan._id} className="border p-4 rounded-lg bg-gray-50 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-900 text-sm">{plan.name}</h4>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-semibold">
                      {plan.durationDays} Days
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Range: ${plan.minInvestment} -${plan.maxInvestment}
                  </p>
                  <p className="text-xs text-green-700 font-semibold mt-1">
                    Return: {plan.profitType === 'percentage' ? `${plan.profitPercentage}%` : `$${plan.fixedProfitAmount} Fixed`}
                  </p>
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t">
                  <button
                    onClick={() => handleEditClick(plan)}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs rounded font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(plan._id)}
                    className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs rounded font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}