import React, { useState } from 'react';

type NotificationCategory = 'All' | 'Academic' | 'Events' | 'System' | 'Unread';

interface Notification {
  id: string;
  title: string;
  content: string;
  category: string;
  timestamp: string;
  isRead: boolean;
  icon: string;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Scheduled Maintenance: Library Portal Down', content: 'The library portal will be unavailable this Sunday from 2 AM to 4 AM.', category: 'System', timestamp: '10 mins ago', isRead: false, icon: 'warning' },
  { id: '2', title: 'Grade Posted: CS101 Midterm', content: 'Results for the Computer Science 101 Midterm exam are now available.', category: 'Academic', timestamp: '2 hours ago', isRead: false, icon: 'school' },
  { id: '3', title: 'Campus Fair Reminder', content: 'The Annual Science Fair starts in 1 hour at the Main Hall.', category: 'Events', timestamp: '3 hours ago', isRead: false, icon: 'event' },
  { id: '4', title: 'Assignment Due: Physics Lab Report', content: 'Your assignment was successfully submitted.', category: 'Academic', timestamp: 'Yesterday', isRead: true, icon: 'assignment' },
  { id: '5', title: 'Password Changed Successfully', content: 'Your account password was updated from a new device.', category: 'System', timestamp: 'Yesterday', isRead: true, icon: 'lock_reset' },
];

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<NotificationCategory>('All');

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleMarkRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'All') return true;
    if (filter === 'Unread') return !n.isRead;
    return n.category === filter;
  });

  const filters: NotificationCategory[] = ['All', 'Unread', 'Academic', 'Events', 'System'];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Academic': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'Events': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      case 'System': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Notifications</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Stay updated with your latest academic, event, and system alerts.</p>
        </div>
        <button 
          onClick={handleMarkAllRead}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">done_all</span>
          Mark all as read
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filter === f 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {f}
            {f === 'Unread' && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                {notifications.filter(n => !n.isRead).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="flex flex-col gap-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div 
              key={notification.id}
              onClick={() => handleMarkRead(notification.id)}
              className={`p-4 bg-white dark:bg-surface-dark rounded-xl border shadow-sm cursor-pointer transition-all hover:shadow-md ${
                notification.isRead 
                  ? 'border-slate-100 dark:border-slate-800 opacity-70' 
                  : 'border-primary/20 bg-primary/5 dark:bg-primary/10'
              }`}
            >
              <div className="flex gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getCategoryColor(notification.category)}`}>
                  <span className="material-symbols-outlined">{notification.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className={`text-sm font-bold ${notification.isRead ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                      {notification.title}
                    </h4>
                    <span className="text-xs text-slate-400 whitespace-nowrap">{notification.timestamp}</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{notification.content}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getCategoryColor(notification.category)}`}>
                      {notification.category}
                    </span>
                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-4xl text-slate-400">notifications_off</span>
            </div>
            <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200">All caught up!</h4>
            <p className="text-slate-500 dark:text-slate-400">No notifications found for this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
