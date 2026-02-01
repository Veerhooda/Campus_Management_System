
import React from 'react';
import { NavItem, User } from '../types';

interface SidebarProps {
  activeNav: NavItem;
  onNavChange: (item: NavItem) => void;
  user: User;
}

const NAV_LINKS = [
  { id: NavItem.Dashboard, icon: 'dashboard' },
  { id: NavItem.MyClasses, icon: 'book_2' },
  { id: NavItem.Students, icon: 'group' },
  { id: NavItem.Gradebook, icon: 'description' },
  { id: NavItem.Calendar, icon: 'calendar_month' },
  { id: NavItem.Settings, icon: 'settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeNav, onNavChange, user }) => {
  return (
    <aside className="flex h-full w-72 flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 transition-all duration-300">
      <div className="flex h-full flex-col justify-between p-4">
        <div className="flex flex-col gap-4">
          {/* Logo */}
          <div className="flex gap-3 px-2 py-3">
            <div className="bg-primary/10 rounded-full size-10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-3xl">school</span>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-slate-900 dark:text-white text-base font-bold leading-none">Smart Campus</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-normal mt-1">Faculty Portal</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-1 mt-6">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavChange(link.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeNav === link.id
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span className={`material-symbols-outlined ${activeNav === link.id ? 'fill-1' : ''}`}>
                  {link.icon}
                </span>
                <span className="text-sm font-semibold">{link.id}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* User Profile */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
          <button className="flex items-center gap-3 px-3 py-2 w-full hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left group">
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-11 ring-2 ring-slate-100 dark:ring-slate-800 group-hover:ring-primary/20 transition-all"
              style={{ backgroundImage: `url("${user.avatar}")` }}
            ></div>
            <div className="flex flex-col overflow-hidden">
              <p className="text-slate-900 dark:text-white text-sm font-bold truncate">{user.name}</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs truncate font-medium">{user.role}</p>
            </div>
            <span className="material-symbols-outlined ml-auto text-slate-400 text-sm">unfold_more</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
