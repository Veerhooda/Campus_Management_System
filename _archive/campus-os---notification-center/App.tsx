
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import NotificationItem from './components/NotificationItem';
import { Notification, NotificationCategory, User } from './types';
import { generateSmartNotification } from './services/geminiService';

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Scheduled Maintenance: Library Portal Down',
    content: 'The library portal will be unavailable this Sunday from 2 AM to 4 AM for critical security upgrades.',
    category: 'System',
    timestamp: '10 mins ago',
    isRead: false,
    priority: 'High',
    icon: 'warning'
  },
  {
    id: '2',
    title: 'Grade Posted: CS101 Midterm',
    content: 'Prof. Smith has uploaded the results for the Computer Science 101 Midterm exam. Check your dashboard for details.',
    category: 'Academic',
    timestamp: '2 hours ago',
    isRead: false,
    actionLabel: 'View Grade',
    icon: 'school'
  },
  {
    id: '3',
    title: 'Campus Fair Reminder',
    content: 'Reminder that the Annual Science Fair starts in 1 hour at the Main Hall.',
    category: 'Events',
    timestamp: '3 hours ago',
    isRead: false,
    icon: 'event'
  },
  {
    id: '4',
    title: 'Assignment Due: Physics Lab Report',
    content: 'Your assignment "Physics Lab Report" was successfully submitted.',
    category: 'Academic',
    timestamp: 'Yesterday at 4:30 PM',
    isRead: true,
    icon: 'assignment'
  },
  {
    id: '5',
    title: 'Password Changed Successfully',
    content: 'Your account password was updated from a new device (MacBook Pro).',
    category: 'System',
    timestamp: 'Yesterday at 9:15 AM',
    isRead: true,
    icon: 'lock_reset'
  },
  {
    id: '6',
    title: 'New Reply in "Introduction to AI"',
    content: 'Sarah Jenkins replied to your comment in the course discussion board.',
    category: 'Community',
    timestamp: 'Yesterday at 8:00 AM',
    isRead: true,
    icon: 'forum'
  }
];

const App: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<NotificationCategory>('All');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const user: User = {
    name: "Alex Johnson",
    avatar: "https://picsum.photos/seed/alex/100/100"
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleMarkRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleGenerateAiNotification = async () => {
    setIsGenerating(true);
    const themes = ["Final exam schedule released", "New internship opportunities", "Guest lecture by Industry Expert", "Cafeteria discount week"];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    const newNotif = await generateSmartNotification(randomTheme);
    if (newNotif) {
      setNotifications(prev => [newNotif as Notification, ...prev]);
    }
    setIsGenerating(false);
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'All') return true;
    if (filter === 'Unread') return !n.isRead;
    return n.category === filter;
  });

  const todayNotifications = filteredNotifications.filter(n => n.timestamp.includes('ago') || n.timestamp === 'Just now');
  const yesterdayNotifications = filteredNotifications.filter(n => n.timestamp.includes('Yesterday'));

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark font-display">
      <Header user={user} onThemeToggle={toggleTheme} isDark={isDarkMode} />
      
      <main className="flex-1 overflow-y-auto">
        <div className="px-4 md:px-10 lg:px-40 flex justify-center py-8">
          <div className="flex flex-col max-w-[960px] flex-1 w-full gap-6">
            
            {/* Page Header */}
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-[#111318] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Notifications</h1>
                <p className="text-[#616f89] dark:text-gray-400 text-base font-normal">Stay updated with your latest academic, event, and system alerts.</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleMarkAllRead}
                  className="flex items-center justify-center rounded-lg h-10 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[#111318] dark:text-white text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] mr-2">done_all</span>
                  Mark all as read
                </button>
                <button 
                  onClick={handleGenerateAiNotification}
                  disabled={isGenerating}
                  className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-sm shadow-primary/30 hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {isGenerating ? 'Generating...' : 'Smart Notification'}
                </button>
              </div>
            </div>

            <FilterBar currentFilter={filter} onFilterChange={setFilter} />

            <div className="flex flex-col gap-8 pb-12">
              {todayNotifications.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h3 className="text-[#111318] dark:text-white text-xs font-bold uppercase tracking-widest opacity-60 px-1">Today</h3>
                  {todayNotifications.map(n => (
                    <NotificationItem key={n.id} notification={n} onMarkRead={handleMarkRead} />
                  ))}
                </div>
              )}

              {yesterdayNotifications.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h3 className="text-[#111318] dark:text-white text-xs font-bold uppercase tracking-widest opacity-60 px-1">Yesterday</h3>
                  {yesterdayNotifications.map(n => (
                    <NotificationItem key={n.id} notification={n} onMarkRead={handleMarkRead} />
                  ))}
                </div>
              )}

              {filteredNotifications.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="size-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-4xl text-gray-400">notifications_off</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">All caught up!</h4>
                  <p className="text-gray-500 dark:text-gray-400">No notifications found for this category.</p>
                </div>
              )}
            </div>

            {filteredNotifications.length > 0 && (
              <div className="flex justify-center py-6 border-t border-gray-200 dark:border-gray-800">
                <button className="text-sm font-semibold text-primary hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-6 py-2 rounded-lg transition-colors">
                  Load older notifications
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
