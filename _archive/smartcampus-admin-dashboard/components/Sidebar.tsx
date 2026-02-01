
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { name: 'Users', icon: 'group', path: '/users' },
    { name: 'Faculty', icon: 'person_apron', path: '/faculty' },
    { name: 'Facilities', icon: 'apartment', path: '/facilities' },
    { name: 'Events', icon: 'calendar_month', path: '/events' },
    { name: 'Logs', icon: 'description', path: '/logs' },
  ];

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col bg-surface-light border-r border-border-light transition-colors hidden lg:flex">
      <div className="h-16 flex items-center gap-3 px-6 border-b border-border-light">
        <div className="bg-primary/10 text-primary rounded-lg p-1.5 flex items-center justify-center">
          <span className="material-symbols-outlined text-[24px]">school</span>
        </div>
        <div>
          <h1 className="text-base font-bold leading-none text-text-main-light">SmartCampus</h1>
          <p className="text-xs text-text-sub-light mt-1">Admin Console</p>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-sub-light hover:bg-gray-100 hover:text-text-main-light'
              }`
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
        
        <div className="my-2 border-t border-border-light mx-3"></div>
        
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm ${
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-text-sub-light hover:bg-gray-100 hover:text-text-main-light'
            }`
          }
        >
          <span className="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="p-4 border-t border-border-light">
        <div className="flex items-center gap-3">
          <img 
            src="https://picsum.photos/seed/admin/40/40" 
            alt="Admin User" 
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-medium text-text-main-light truncate">Admin User</p>
            <p className="text-xs text-text-sub-light truncate">admin@campus.edu</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
