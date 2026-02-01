
import React from 'react';

const MiniCalendar: React.FC = () => {
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const dates = [
    { value: 28, muted: true },
    { value: 29, muted: true },
    { value: 30, muted: true },
    { value: 1, currentMonth: true },
    { value: 2, currentMonth: true },
    { value: 3, currentMonth: true, dot: 'bg-red-500' },
    { value: 4, currentMonth: true },
    { value: 5, currentMonth: true },
    { value: 6, currentMonth: true },
    { value: 7, currentMonth: true, active: true },
    { value: 8, currentMonth: true },
    { value: 9, currentMonth: true, dot: 'bg-green-500' },
    { value: 10, currentMonth: true },
    { value: 11, currentMonth: true },
  ];

  return (
    <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">October 2023</h3>
        <div className="flex gap-1">
          <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500">
            <span className="material-symbols-outlined text-lg">chevron_left</span>
          </button>
          <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500">
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 text-center text-xs text-slate-500 mb-2 font-medium">
        {days.map(d => <div key={d}>{d}</div>)}
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {dates.map((d, i) => (
          <div 
            key={i}
            className={`p-2 rounded cursor-pointer relative ${
              d.muted ? 'text-slate-300 dark:text-slate-600' : 
              d.active ? 'bg-primary text-white shadow-sm font-semibold' : 
              'hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {d.value}
            {d.dot && (
              <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 ${d.dot} rounded-full`}></span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiniCalendar;
