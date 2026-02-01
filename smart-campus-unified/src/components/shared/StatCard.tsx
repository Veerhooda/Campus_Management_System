import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  colorClass?: string;
  bgClass?: string;
  trend?: string;
  subtext?: string;
  badge?: string;
  status?: string;
  showProgressRing?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  colorClass = 'text-primary',
  bgClass = 'bg-primary/10',
  trend,
  subtext,
  badge,
  status,
  showProgressRing = false,
}) => {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {value}
            </span>
            {trend && (
              <span className={`text-xs font-semibold ${
                trend.startsWith('+') ? 'text-green-600' : trend.startsWith('-') ? 'text-red-500' : 'text-slate-500'
              }`}>
                {trend}
              </span>
            )}
            {badge && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                status === 'Urgent' 
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                  : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              }`}>
                {badge}
              </span>
            )}
          </div>
          {subtext && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              {subtext}
            </p>
          )}
        </div>
        
        <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${bgClass} flex items-center justify-center ${colorClass}`}>
          {showProgressRing ? (
            <div className="relative w-10 h-10">
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity="0.2"
                  strokeWidth="4"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray={`${(Number(String(value).replace('%', '')) / 100) * 88} 88`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          ) : (
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>{icon}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
