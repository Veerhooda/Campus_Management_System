
import React from 'react';
import { NotificationCategory } from '../types';

interface FilterBarProps {
  currentFilter: NotificationCategory;
  onFilterChange: (filter: NotificationCategory) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ currentFilter, onFilterChange }) => {
  const filters: { label: NotificationCategory; icon?: string }[] = [
    { label: 'All' },
    { label: 'Unread', icon: 'fiber_manual_record' },
    { label: 'Academic', icon: 'school' },
    { label: 'Events', icon: 'calendar_month' },
    { label: 'System', icon: 'dns' }
  ];

  return (
    <div className="flex flex-wrap gap-2 py-4">
      {filters.map((f) => {
        const isActive = currentFilter === f.label;
        return (
          <button
            key={f.label}
            onClick={() => onFilterChange(f.label)}
            className={`flex h-9 items-center justify-center gap-x-2 rounded-full px-4 transition-all duration-200 border ${
              isActive 
                ? 'bg-[#111318] dark:bg-white text-white dark:text-[#111318] border-transparent shadow-md' 
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-[#111318] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {f.icon && (
              <span className={`material-symbols-outlined text-[18px] ${isActive ? '' : 'text-gray-500 group-hover:text-primary'}`}>
                {f.icon}
              </span>
            )}
            <span className="text-sm font-medium">{f.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default FilterBar;
