
import React from 'react';
import { ActionItem } from '../types';

export const ImmediateActions: React.FC<{ actions: ActionItem[] }> = ({ actions }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-3">
          <span className="material-symbols-outlined text-orange-500 text-2xl">task_alt</span>
          Immediate Actions
        </h3>
      </div>
      <div className="p-5 flex flex-col gap-4">
        {actions.map((action) => (
          <div 
            key={action.id}
            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer group ${
              action.color === 'orange' 
                ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-800/30 hover:shadow-md' 
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className={`p-2.5 rounded-xl text-lg flex items-center justify-center transition-all ${
              action.color === 'orange' 
                ? 'bg-white dark:bg-slate-800 text-orange-500 shadow-sm' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-primary'
            }`}>
              <span className="material-symbols-outlined block">{action.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-800 dark:text-slate-200">{action.title}</p>
              <p className="text-xs text-slate-500 font-medium truncate">{action.subtitle}</p>
            </div>
            {action.actionLabel ? (
              <button className="text-xs font-black bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl shadow-lg shadow-orange-100 dark:shadow-none transition-all hover:scale-105">
                {action.actionLabel}
              </button>
            ) : (
              <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-all group-hover:translate-x-1">
                chevron_right
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
