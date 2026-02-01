
import React from 'react';
import { NavItem } from '../types';

interface SidebarProps {
  activeTab: NavItem;
  setActiveTab: (tab: NavItem) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const mainNav = [
    { name: NavItem.Dashboard, icon: 'grid_view' },
    { name: NavItem.Courses, icon: 'book' },
    { name: NavItem.Schedule, icon: 'calendar_month' },
    { name: NavItem.Grades, icon: 'school' },
    { name: NavItem.Library, icon: 'local_library' },
  ];

  const bottomNav = [
    { name: NavItem.Settings, icon: 'settings' },
  ];

  return (
    <aside className="w-64 bg-surface-light dark:bg-surface-dark border-r border-slate-200 dark:border-slate-800 hidden lg:flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-lg">
          <span className="material-symbols-outlined text-primary text-3xl">school</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold leading-tight">Smart Campus</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Student Portal</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-2 flex flex-col gap-1 overflow-y-auto">
        {mainNav.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              activeTab === item.name
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium'
            }`}
          >
            <span 
              className="material-symbols-outlined" 
              style={{ fontVariationSettings: activeTab === item.name ? "'FILL' 1" : "" }}
            >
              {item.icon}
            </span>
            <span className="text-sm">{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1">
        {bottomNav.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              activeTab === item.name
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-sm">{item.name}</span>
          </button>
        ))}
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined">logout</span>
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
