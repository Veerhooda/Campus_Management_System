import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 animate-fade-in">
      <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-5xl text-slate-400">settings</span>
      </div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">System Settings</h1>
      <p className="text-slate-500 dark:text-slate-400 max-w-md">
        This page is currently under construction. Future updates will allow you to configure system-wide preferences, notifications, and permissions.
      </p>
    </div>
  );
};

export default Settings;
