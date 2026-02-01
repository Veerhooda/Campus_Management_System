
import React from 'react';
import { Stat } from '../types';

interface StatCardProps extends Stat {
  showProgressRing?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  subtext, 
  status, 
  icon, 
  colorClass, 
  bgClass, 
  badge, 
  showProgressRing 
}) => {
  return (
    <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col relative overflow-hidden group hover:border-primary/30 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${bgClass} ${colorClass}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        {badge && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${status === 'Urgent' ? 'bg-pink-100 text-pink-700' : 'bg-green-100 text-green-700'}`}>
            {badge}
          </span>
        )}
        {!badge && status && (
           <span className="text-xs font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full">
            {status}
           </span>
        )}
      </div>
      
      <div className="flex flex-col gap-1">
        <span className="text-4xl font-bold text-slate-900 dark:text-white">{value}</span>
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
      </div>

      {subtext && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
           <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
             {subtext}
           </p>
        </div>
      )}

      {showProgressRing && (
        <svg className="absolute -bottom-4 -right-4 text-primary/5 w-32 h-32" viewBox="0 0 100 100">
          <circle cx="50" cy="50" fill="none" r="40" stroke="currentColor" strokeWidth="12"></circle>
          <path className="text-primary/10" d="M50 10 A 40 40 0 1 1 20 75" fill="none" stroke="currentColor" strokeWidth="12"></path>
        </svg>
      )}
    </div>
  );
};

export default StatCard;
