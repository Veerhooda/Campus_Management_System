
import React from 'react';
import { StatItem } from '../types';

interface StatCardProps {
  stat: StatItem;
}

const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  return (
    <div className="bg-surface-light rounded-xl p-6 border border-border-light shadow-sm flex flex-col justify-between h-[160px] hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-sub-light">{stat.label}</p>
          <h3 className="text-3xl font-bold text-text-main-light mt-2">{stat.value}</h3>
        </div>
        <div className={`${stat.colorClass} p-2.5 rounded-xl`}>
          <span className="material-symbols-outlined block">{stat.icon}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-auto">
        {stat.trend && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
            stat.trendUp 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            <span className="material-symbols-outlined text-[14px]">
              {stat.trendUp ? 'trending_up' : 'trending_down'}
            </span> 
            {stat.trend}
          </span>
        )}
        {stat.status && (
          <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             <span className="text-sm font-medium text-green-600">{stat.status}</span>
          </div>
        )}
        {stat.trend && <span className="text-xs text-text-sub-light">vs last month</span>}
      </div>
    </div>
  );
};

export default StatCard;
