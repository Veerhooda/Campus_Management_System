
import React from 'react';
import { Metric } from '../types';

const StatCard: React.FC<Metric> = ({ label, value, trend, icon, colorClass, bgClass }) => {
  return (
    <div className="bg-white dark:bg-[#1A202C] rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col gap-4 relative overflow-hidden group">
      <div className="flex justify-between items-start z-10">
        <div className={`p-2 ${bgClass} rounded-lg ${colorClass}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        {trend && (
          <span className="flex items-center text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded text-xs font-bold">
            <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span> {trend}
          </span>
        )}
      </div>
      <div className="z-10">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{value}</h3>
          {label === 'Feedback Score' && <span className="text-slate-400 text-sm font-medium">/ 5.0</span>}
        </div>
      </div>
      <div className="absolute -right-6 -bottom-6 opacity-5 dark:opacity-[0.02]">
        <span className="material-symbols-outlined text-[120px]">{icon}</span>
      </div>
    </div>
  );
};

export default StatCard;
