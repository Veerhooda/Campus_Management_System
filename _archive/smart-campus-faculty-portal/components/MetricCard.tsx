
import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  unit?: string;
  trend?: string;
  trendType?: 'positive' | 'warning' | 'neutral';
  icon: string;
  iconColorClass: string;
  bgColorClass: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title, value, unit, trend, trendType = 'neutral', icon, iconColorClass, bgColorClass
}) => {
  const trendColor = trendType === 'positive' ? 'text-green-600' : trendType === 'warning' ? 'text-orange-500' : 'text-slate-500';
  const trendIcon = trendType === 'positive' ? 'trending_up' : trendType === 'warning' ? 'warning' : '';

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between group hover:border-primary/50 hover:shadow-md transition-all duration-300">
      <div className="flex flex-col gap-1">
        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">{title}</p>
        <div className="flex items-baseline gap-2 mt-2">
          <p className="text-4xl font-black text-slate-900 dark:text-white">{value}</p>
          {unit && <span className="text-lg text-slate-400 font-medium">{unit}</span>}
        </div>
        {trend && (
          <p className={`${trendColor} text-xs font-bold mt-3 flex items-center gap-1.5`}>
            {trendIcon && <span className="material-symbols-outlined text-[16px]">{trendIcon}</span>}
            {trend}
          </p>
        )}
      </div>
      <div className={`size-12 rounded-2xl ${bgColorClass} flex items-center justify-center ${iconColorClass} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
    </div>
  );
};
