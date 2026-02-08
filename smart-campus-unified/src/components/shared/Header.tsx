import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth, getPrimaryRole, getDisplayName } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  onMenuClick: () => void;
}

// Role display name mapping
const getRoleDisplayName = (roles: string[]): string => {
  const primary = getPrimaryRole(roles as any);
  switch (primary) {
    case 'STUDENT': return 'Student';
    case 'TEACHER': return 'Faculty';
    case 'ADMIN': return 'Admin';
    case 'ORGANIZER': return 'Organizer';
    default: return primary;
  }
};

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();

  // Get page title from path
  const getPageTitle = (): string => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1] || 'Dashboard';
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, ' ');
  };

  // Get breadcrumb from path
  const getBreadcrumb = (): string[] => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    return segments.map(s => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' '));
  };

  const breadcrumbs = getBreadcrumb();
  const displayName = user ? getDisplayName(user) : 'User';
  const roleDisplay = user ? getRoleDisplayName(user.roles) : '';
  const initials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U' : 'U';

  return (
    <header className="h-16 min-h-16 flex items-center justify-between px-4 md:px-6 bg-white dark:bg-surface-dark border-b border-slate-200 dark:border-slate-800">
      {/* Left: Menu button + Breadcrumb */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors md:hidden"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        
        {/* Breadcrumb */}
        <nav className="hidden sm:flex items-center gap-2 text-sm">
          <span className="text-slate-400 dark:text-slate-500">Home</span>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <span className="text-slate-300 dark:text-slate-600">/</span>
              <span className={index === breadcrumbs.length - 1 
                ? 'text-slate-800 dark:text-white font-semibold' 
                : 'text-slate-400 dark:text-slate-500'
              }>
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </nav>

        {/* Mobile title */}
        <h1 className="text-lg font-bold text-slate-800 dark:text-white sm:hidden">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Search (hidden on mobile) */}
        <div className="hidden md:flex items-center bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 w-64">
          <span className="material-symbols-outlined text-slate-400 text-[20px] mr-2">search</span>
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none text-sm w-full text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
          />
        </div>

        {/* Theme toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span className="material-symbols-outlined">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-surface-dark" />
        </button>

        {/* Divider */}
        <div className="hidden md:block h-8 w-px bg-slate-200 dark:bg-slate-700" />

        {/* User avatar (desktop only) */}
        {user && (
          <div className="hidden md:flex items-center gap-3 cursor-pointer p-1 pr-3 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-primary font-bold text-sm">
              {initials}
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-none">{displayName}</p>
              <p className="text-xs text-slate-400 mt-0.5">{roleDisplay}</p>
            </div>
            <span className="material-symbols-outlined text-slate-400 text-[18px]">expand_more</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
