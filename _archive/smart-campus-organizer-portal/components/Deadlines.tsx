
import React from 'react';
import { Deadline } from '../types';

interface DeadlinesProps {
  deadlines: Deadline[];
}

const Deadlines: React.FC<DeadlinesProps> = ({ deadlines }) => {
  return (
    <div className="bg-white dark:bg-[#1A202C] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-6 flex-1">
      <h3 className="font-bold text-slate-900 dark:text-white mb-4">Upcoming Deadlines</h3>
      <div className="flex flex-col gap-4">
        {deadlines.map((item) => (
          <div key={item.id} className="flex items-start gap-3 group cursor-pointer">
            <div className={`mt-1 size-5 rounded-full border-2 transition-colors flex items-center justify-center ${
              item.dueColor === 'orange' 
                ? 'border-orange-200 dark:border-orange-800 group-hover:border-orange-500' 
                : 'border-slate-200 dark:border-slate-600 group-hover:border-primary'
            }`}>
              <div className={`size-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                item.dueColor === 'orange' ? 'bg-orange-500' : 'bg-primary'
              }`}></div>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors">
                {item.title}
              </p>
              <p className={`text-xs font-medium ${
                item.dueColor === 'orange' ? 'text-orange-600' : 'text-slate-500'
              }`}>
                {item.dueText}
              </p>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-6 py-2 text-sm text-primary font-medium border border-dashed border-primary/30 rounded-lg hover:bg-primary/5 transition-colors">
        + Add New Task
      </button>
    </div>
  );
};

export default Deadlines;
