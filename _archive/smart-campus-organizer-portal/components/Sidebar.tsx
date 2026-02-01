
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'events', label: 'Events', icon: 'calendar_month' },
  { id: 'attendees', label: 'Attendees', icon: 'groups' },
  { id: 'reports', label: 'Reports', icon: 'description' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-[#1A202C] border-r border-slate-200 dark:border-slate-700 h-full flex-shrink-0 transition-all duration-300">
      <div className="p-6 flex flex-col h-full justify-between">
        <div className="flex flex-col gap-8">
          {/* Branding */}
          <div className="flex items-center gap-3 px-2">
            <div className="bg-gradient-to-br from-primary to-blue-400 rounded-lg size-10 shadow-sm flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-xl">school</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">Smart Campus</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Organizer Portal</p>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                  activeTab === item.id 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${activeTab === item.id ? 'fill' : ''}`}>
                  {item.icon}
                </span>
                <p className={`text-sm ${activeTab === item.id ? 'font-semibold' : 'font-medium'}`}>
                  {item.label}
                </p>
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors w-full text-left">
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <p className="text-sm font-medium">Log Out</p>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
