
import React from 'react';
import { ClassSession } from '../types';

export const TodaySchedule: React.FC<{ sessions: ClassSession[] }> = ({ sessions }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
        <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-2xl">calendar_today</span>
          Today's Schedule
        </h3>
        <button className="text-sm text-primary font-bold hover:underline transition-all">View Calendar</button>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {sessions.map((session) => (
          <div 
            key={session.id} 
            className={`p-6 flex flex-col sm:flex-row gap-6 sm:items-center transition-colors group ${
              session.status === 'Completed' ? 'bg-slate-50/50 dark:bg-slate-800/10' : 'bg-white dark:bg-slate-900'
            }`}
          >
            {/* Time Slot */}
            <div className="min-w-[120px] flex sm:flex-col items-center sm:items-start gap-2 sm:gap-0">
              <span className={`text-base font-bold transition-all ${
                session.status === 'Completed' ? 'text-slate-400 line-through' : session.status === 'Now' ? 'text-primary' : 'text-slate-900 dark:text-white'
              }`}>
                {session.startTime}
              </span>
              <span className={`text-xs font-medium transition-all ${
                session.status === 'Completed' ? 'text-slate-300' : 'text-slate-500'
              }`}>
                {session.endTime}
              </span>
            </div>

            {/* Class Details */}
            <div className={`flex-1 border-l-4 pl-6 py-1 transition-all ${
              session.status === 'Completed' ? 'border-slate-200 dark:border-slate-800' : session.status === 'Now' ? 'border-primary' : 'border-slate-200 dark:border-slate-700'
            }`}>
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div className="space-y-1">
                  <h4 className={`text-lg font-black transition-all ${
                    session.status === 'Completed' ? 'text-slate-400' : 'text-slate-900 dark:text-white'
                  }`}>
                    {session.title}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                    {session.location}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  {session.status === 'Now' && (
                    <span className="bg-blue-50 dark:bg-blue-900/30 text-primary text-[10px] uppercase px-2 py-1 rounded-lg font-black animate-pulse tracking-widest border border-primary/20">
                      Now
                    </span>
                  )}
                  {session.status === 'Now' ? (
                    <button className="bg-primary text-white text-xs px-5 py-2 rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-200 dark:shadow-none">
                      Start Class
                    </button>
                  ) : (
                    <span className={`text-[10px] uppercase px-2 py-1 rounded-lg font-bold tracking-widest border ${
                      session.status === 'Completed' 
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent' 
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                    }`}>
                      {session.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
