
import React from 'react';

const Calendar: React.FC = () => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const emptyPre = Array.from({ length: 2 }); // October 2023 started on a Sunday, simplified layout

  return (
    <div className="bg-white dark:bg-[#1A202C] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900 dark:text-white">October 2023</h3>
        <div className="flex gap-1">
          <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500">
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500">
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <span key={d} className="text-xs font-medium text-slate-400">{d}</span>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-sm text-center">
        {emptyPre.map((_, i) => (
          <span key={`pre-${i}`} className="p-2 text-slate-300 dark:text-slate-600">{29 + i}</span>
        ))}
        {days.map(day => (
          <span
            key={day}
            className={`p-2 rounded-full cursor-pointer transition-all ${
              day === 24 
                ? 'bg-primary text-white font-bold shadow-md shadow-blue-500/30' 
                : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {day}
          </span>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex gap-2 items-center text-xs text-slate-500">
        <div className="size-2 rounded-full bg-primary"></div>
        <span>Event Scheduled</span>
      </div>
    </div>
  );
};

export default Calendar;
