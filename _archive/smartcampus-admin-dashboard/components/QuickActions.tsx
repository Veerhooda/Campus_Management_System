
import React from 'react';

const QuickActions: React.FC = () => {
  const actions = [
    { label: 'Add User', icon: 'person_add', color: 'text-primary' },
    { label: 'Broadcast Alert', icon: 'campaign', color: 'text-orange-500' },
    { label: 'Generate Report', icon: 'description', color: 'text-green-500' },
    { label: 'Reset Password', icon: 'lock_reset', color: 'text-purple-500' },
  ];

  return (
    <div className="bg-surface-light rounded-xl border border-border-light shadow-sm p-6">
      <h3 className="text-base font-bold text-text-main-light mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => (
          <button 
            key={action.label}
            className="flex items-center justify-center gap-2 p-3 rounded-lg border border-border-light hover:bg-background-light transition-all group outline-none focus:ring-2 focus:ring-primary/20"
          >
            <span className={`material-symbols-outlined ${action.color} group-hover:scale-110 transition-transform`}>
              {action.icon}
            </span>
            <span className="text-sm font-medium text-text-main-light">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
