
import React from 'react';

interface StatsCardProps {
  label: string;
  value: number | string;
  trend: number;
  icon: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, trend, icon }) => {
  const isPositive = trend >= 0;
  
  return (
    <div className="flex flex-col gap-2 rounded-xl p-5 border border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-[#1e293b] shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <p className="text-[#616f89] dark:text-gray-400 text-sm font-medium leading-normal">{label}</p>
        <span className="material-symbols-outlined text-[#616f89] dark:text-gray-500 !text-[20px]">{icon}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-[#111318] dark:text-white text-3xl font-bold leading-tight">{value}</p>
        <p className={`text-xs font-medium px-1.5 py-0.5 rounded ${
          isPositive 
            ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' 
            : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
        }`}>
          {isPositive ? '+' : ''}{trend}%
        </p>
      </div>
    </div>
  );
};
