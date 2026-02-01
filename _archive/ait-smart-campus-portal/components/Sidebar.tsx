
import React from 'react';
import { User } from '../types';

interface SidebarProps {
  user: User;
  isOpen: boolean;
  toggle: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, isOpen, toggle, onLogout }) => {
  const menuItems = [
    { icon: 'grid_view', label: 'Dashboard', active: true },
    { icon: 'book', label: 'My Courses' },
    { icon: 'calendar_month', label: 'Schedule' },
    { icon: 'description', label: 'Assignments' },
    { icon: 'payments', label: 'Finances' },
    { icon: 'settings', label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {!isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={toggle}
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        w-72 bg-white dark:bg-[#1e293b] border-r border-slate-200 dark:border-slate-800
        transition-transform duration-300 transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="p-8 flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>school</span>
            </div>
            <span className="font-bold text-xl text-slate-800 dark:text-white tracking-tight">AIT Portal</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.label}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                  ${item.active 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary'}
                `}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 mt-auto border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl mb-3">
              <img src={user.avatar} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800" alt={user.name} />
              <div className="overflow-hidden">
                <p className="font-bold text-sm text-slate-800 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-primary font-medium">{user.role}</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
