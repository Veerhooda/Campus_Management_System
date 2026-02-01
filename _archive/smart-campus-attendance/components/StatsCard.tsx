
import React from 'react';

interface StatsCardProps {
  label: string;
  value: number;
  icon: string;
  colorClass: string;
  subValue?: string;
  bgGlowColor?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  label, 
  value, 
  icon, 
  colorClass, 
  subValue, 
  bgGlowColor = 'bg-slate-500/5' 
}) => {
  return (
    <div className="bg-white dark:bg-[#1a2230] p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between h-full relative overflow-hidden transition-all hover:shadow-md">
      <div className={`absolute top-0 right-0 w-16 h-16 ${bgGlowColor} rounded-bl-full -mr-4 -mt-4`}></div>
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{label}</p>
      <div className="flex items-end justify-between z-10">
        <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
        {subValue ? (
          <div className={`flex items-center text-xs font-medium ${colorClass} bg-opacity-10 bg-current px-2 py-0.5 rounded-full`}>
            {subValue}
          </div>
        ) : (
          <span className={`material-symbols-outlined ${colorClass} bg-opacity-5 bg-current p-1 rounded-md text-[20px]`}>
            {icon}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
