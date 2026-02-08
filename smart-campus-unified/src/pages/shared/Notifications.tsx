import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services';
import { Notification as NotificationType } from '../../types';

type NotificationCategory = 'All' | 'ACADEMIC' | 'EVENT' | 'SYSTEM' | 'ALERT' | 'Unread';

const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded ${className}`} />
);

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<NotificationCategory>('All');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await notificationService.getNotifications(1, 50);
        setNotifications(data.data);
      } catch (err) {
        console.error('Failed to load notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'All') return true;
    if (filter === 'Unread') return !n.isRead;
    return n.type === filter;
  });

  const filters: NotificationCategory[] = ['All', 'Unread', 'ACADEMIC', 'EVENT', 'SYSTEM', 'ALERT'];
  const filterLabels: Record<string, string> = {
    All: 'All',
    Unread: 'Unread',
    ACADEMIC: 'Academic',
    EVENT: 'Events',
    SYSTEM: 'System',
    ALERT: 'Alerts',
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ACADEMIC': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'EVENT': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      case 'SYSTEM': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'ALERT': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ACADEMIC': return 'school';
      case 'EVENT': return 'event';
      case 'SYSTEM': return 'settings';
      case 'ALERT': return 'warning';
      default: return 'info';
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
          disabled={loading || notifications.every(n => n.isRead)}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            {filterLabels[f]}
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
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        ) : filteredNotifications.length > 0 ? (
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
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getCategoryColor(notification.type)}`}>
                  <span className="material-symbols-outlined">{getCategoryIcon(notification.type)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className={`text-sm font-bold ${notification.isRead ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                      {notification.title}
                    </h4>
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {new Date(notification.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{notification.message}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getCategoryColor(notification.type)}`}>
                      {filterLabels[notification.type] || notification.type}
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
