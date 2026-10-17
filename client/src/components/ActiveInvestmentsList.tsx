'use client';

import { useState } from 'react';

interface InvestmentPlanConfig {
  name: string;
  profitPercentage: number;
}

interface UserInvestment {
  _id: string;
  planConfig?: InvestmentPlanConfig;
  investedAmount: number;
  currentProfit: number;
  targetProfit: number;
  startDate: string | Date;
  endDate: string | Date;
  status: 'active' | 'completed' | 'cancelled';
}

export default function ActiveInvestmentsList({ investments }: { investments: UserInvestment[] }) {
  if (!investments || investments.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border text-center text-xs text-gray-500 font-mono shadow-sm">
        You have no active or completed investments yet. Choose a plan above to start earning!
      </div>
    );
  }

  return (
    <div className="space-y-4 font-mono">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Your Investment Portfolio</h2>
        <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-semibold">
          {investments.filter(i => i.status === 'active').length} Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {investments.map((inv) => {
          // Calculate profit progress percentage (capped at 100%)
          const profitProgress = Math.min(
            Math.round((inv.currentProfit / inv.targetProfit) * 100) || 0,
            100
          );

          // Calculate time progress
          const start = new Date(inv.startDate).getTime();
          const end = new Date(inv.endDate).getTime();
          const now = Date.now();
          const totalDuration = end - start;
          const elapsed = now - start;
          const timeProgress = Math.min(Math.max(Math.round((elapsed / totalDuration) * 100), 0), 100);

          const isActive = inv.status === 'active';

          return (
            <div 
              key={inv._id} 
              className={`bg-white border rounded-xl p-5 shadow-sm space-y-4 relative flex flex-col justify-between transition-all ${
                isActive ? 'border-gray-200' : 'bg-gray-50/70 border-gray-300 opacity-90'
              }`}
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-base text-gray-900">
                    {inv.planConfig?.name || 'Investment Plan'}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Started: {new Date(inv.startDate).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full uppercase tracking-wider ${
                  isActive 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {inv.status}
                </span>
              </div>

              {/* Financial Metrics */}
              <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-lg border text-center">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase">Invested</p>
                  <p className="text-sm font-bold text-gray-800">${inv.investedAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase">Profit Earned</p>
                  <p className="text-sm font-bold text-green-600">+${inv.currentProfit.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase">Target Profit</p>
                  <p className="text-sm font-bold text-gray-800">${inv.targetProfit.toFixed(2)}</p>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-3 pt-1">
                {/* Profit Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 font-medium">Profit Progress</span>
                    <span className="font-bold text-gray-900">{profitProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden border">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${profitProgress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Time Progress / Expiry */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 font-medium">Time Elapsed</span>
                    <span className="font-bold text-gray-900">
                      {isActive ? `${timeProgress}% (${Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)))} days left)` : 'Completed'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden border">
                    <div 
                      className="bg-black h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${timeProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Footer Expiry Date */}
              <div className="border-t pt-3 flex justify-between items-center text-[11px] text-gray-500">
                <span>Maturity Date:</span>
                <span className="font-semibold text-gray-700">{new Date(inv.endDate).toLocaleDateString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}