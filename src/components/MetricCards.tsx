import React from 'react';
import type { MetricItem } from '../types/dashboard';

interface MetricCardsProps {
  metrics?: MetricItem[];
}

export const MetricCards: React.FC<MetricCardsProps> = ({ metrics = [] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {metrics.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-xl border border-slate-200/80 p-5 md:p-6 shadow-xs flex flex-col justify-between"
        >
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1.5">{item.label}</p>
            <p
              className={`text-3xl font-bold tracking-tight mb-2 ${
                item.isPrimary ? 'text-[#4F46E5]' : 'text-slate-900'
              }`}
            >
              {item.value}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-emerald-600">{item.change}</span>
            <span className="text-slate-400">{item.changeContext}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
