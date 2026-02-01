
import React from 'react';
import { AttendanceStatus } from '../types';

interface AttendanceToggleProps {
  status: AttendanceStatus;
  onChange: (status: AttendanceStatus) => void;
}

const AttendanceToggle: React.FC<AttendanceToggleProps> = ({ status, onChange }) => {
  return (
    <div className="inline-flex rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden" role="group">
      <button
        onClick={() => onChange(AttendanceStatus.PRESENT)}
        className={`px-4 py-1.5 text-xs font-medium transition-colors ${
          status === AttendanceStatus.PRESENT
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-r border-emerald-200 dark:border-emerald-800'
            : 'bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 border-r border-slate-200 dark:border-slate-700'
        }`}
        type="button"
      >
        Present
      </button>
      <button
        onClick={() => onChange(AttendanceStatus.LATE)}
        className={`px-4 py-1.5 text-xs font-medium transition-colors border-r ${
          status === AttendanceStatus.LATE
            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-amber-200 dark:border-amber-800'
            : 'bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
        }`}
        type="button"
      >
        Late
      </button>
      <button
        onClick={() => onChange(AttendanceStatus.ABSENT)}
        className={`px-4 py-1.5 text-xs font-medium transition-colors ${
          status === AttendanceStatus.ABSENT
            ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400'
            : 'bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
        }`}
        type="button"
      >
        Absent
      </button>
    </div>
  );
};

export default AttendanceToggle;
