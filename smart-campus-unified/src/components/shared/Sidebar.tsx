import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth, getPrimaryRole, getDisplayName } from '../../context/AuthContext';
import { NavItem, UserRole } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

// Navigation items by role
const getNavigationItems = (role: UserRole): NavItem[] => {
  const baseRoute = role === 'TEACHER' ? 'faculty' : role.toLowerCase();
  
  const commonItems: NavItem[] = [
    { icon: 'notifications', label: 'Notifications', path: `/${baseRoute}/notifications` },
  ];

  const studentItems: NavItem[] = [
    { icon: 'grid_view', label: 'Dashboard', path: '/student/dashboard' },
    { icon: 'calendar_month', label: 'Schedule', path: '/student/schedule' },
    { icon: 'library_books', label: 'Notes', path: '/student/notes' },
    { icon: 'support_agent', label: 'Grievances', path: '/student/grievances' },
    { icon: 'build', label: 'Maintenance', path: '/student/maintenance' },
    ...commonItems,
  ];

  const facultyItems: NavItem[] = [
    { icon: 'grid_view', label: 'Dashboard', path: '/faculty/dashboard' },
    { icon: 'calendar_month', label: 'Schedule', path: '/faculty/schedule' },
    { icon: 'check_circle', label: 'Mark Attendance', path: '/faculty/attendance' },
    { icon: 'upload_file', label: 'Upload Notes', path: '/faculty/notes' },
    { icon: 'campaign', label: 'Broadcast', path: '/faculty/broadcast' },
    ...commonItems,
  ];

  const adminItems: NavItem[] = [
    { icon: 'grid_view', label: 'Dashboard', path: '/admin/dashboard' },
    { icon: 'people', label: 'User Management', path: '/admin/users' },
    { icon: 'campaign', label: 'Broadcast', path: '/admin/broadcast' },
    { icon: 'calendar_month', label: 'Timetable', path: '/admin/timetable' },
    { icon: 'event', label: 'Events', path: '/admin/events' },
    { icon: 'support_agent', label: 'Grievances', path: '/admin/grievances' },
    { icon: 'celebration', label: 'Organizer Portal', path: '/admin/organizer' },
    ...commonItems,
  ];

  const organizerItems: NavItem[] = [
    { icon: 'grid_view', label: 'Dashboard', path: '/organizer/dashboard' },
    { icon: 'event', label: 'Events', path: '/organizer/events' },
    ...commonItems,
  ];

  switch (role) {
    case 'STUDENT':
      return studentItems;
    case 'TEACHER':
      return facultyItems;
    case 'ADMIN':
      return adminItems;
    case 'ORGANIZER':
      return organizerItems;
    default:
      return studentItems;
  }
};

// Role display name mapping
const getRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case 'STUDENT': return 'Student';
    case 'TEACHER': return 'Faculty';
    case 'ADMIN': return 'Admin';
    case 'ORGANIZER': return 'Organizer';
    default: return role;
  }
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const primaryRole = getPrimaryRole(user.roles);
  const navItems = getNavigationItems(primaryRole);
  const displayName = getDisplayName(user);
  const roleDisplay = getRoleDisplayName(primaryRole);
  
  // Generate avatar from initials
  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U';

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={toggle}
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        w-72 bg-white dark:bg-surface-dark border-r border-slate-200 dark:border-slate-800
        transition-transform duration-300 transform flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800">
          <img src="/assets/ait-logo.png" alt="AIT Logo" className="w-10 h-10 rounded-xl shadow-lg bg-white dark:bg-slate-100 p-0.5" />
          <div>
            <span className="font-bold text-lg text-slate-800 dark:text-white tracking-tight block">AIT Portal</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{roleDisplay} View</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
                           (item.path.includes('dashboard') && location.pathname.endsWith('dashboard'));
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                  ${isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary'}
                `}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-white dark:border-slate-700 flex items-center justify-center text-primary font-bold">
              {initials}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="font-bold text-sm text-slate-800 dark:text-white truncate">{displayName}</p>
              <p className="text-xs text-primary font-medium">{roleDisplay}</p>
            </div>
          </div>
          <button 
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
