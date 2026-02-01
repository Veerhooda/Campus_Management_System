
import React from 'react';
import { Submission } from '../types';

export const NeedsGrading: React.FC<{ submissions: Submission[] }> = ({ submissions }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex-1 overflow-hidden transition-all hover:shadow-md">
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-3">
          <span className="material-symbols-outlined text-purple-600 text-2xl">file_present</span>
          Needs Grading
        </h3>
        <button className="text-xs text-slate-500 hover:text-primary font-bold transition-all">View All</button>
      </div>
      <div className="p-3">
        {submissions.map((submission) => (
          <div 
            key={submission.id}
            className="flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all cursor-pointer group"
          >
            <div className="relative shrink-0">
              {submission.studentAvatar ? (
                <div 
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-11 border-2 border-slate-100 dark:border-slate-800 shadow-sm group-hover:border-primary/20 transition-all"
                  style={{ backgroundImage: `url("${submission.studentAvatar}")` }}
                ></div>
              ) : (
                <div className="flex items-center justify-center bg-primary/10 text-primary font-black rounded-full size-11 border-2 border-slate-100 dark:border-slate-800 text-sm">
                  {submission.initials}
                </div>
              )}
              {submission.verified && (
                <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 rounded-full p-0.5 border-2 border-white dark:border-slate-900 shadow-sm">
                  <span className="material-symbols-outlined text-[10px] text-white font-black block">check</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <p className="text-sm font-black text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">
                  {submission.studentName}
                </p>
                <span className="text-[10px] text-slate-400 font-bold">{submission.timeAgo}</span>
              </div>
              <p className="text-xs text-slate-500 font-medium truncate italic">
                {submission.assignmentTitle}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
        <button className="w-full py-2.5 text-sm text-primary font-black hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm active:scale-95">
          Go to Gradebook
        </button>
      </div>
    </div>
  );
};
