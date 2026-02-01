
import React from 'react';
import { Notification } from '../types';

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkRead }) => {
  const getIconColor = (category: string) => {
    switch (category) {
      case 'Academic': return 'bg-blue-50 text-primary dark:bg-blue-900/20';
      case 'System': return 'bg-red-50 text-red-600 dark:bg-red-900/30';
      case 'Events': return 'bg-purple-50 text-purple-600 dark:bg-purple-900/20';
      case 'Community': return 'bg-orange-50 text-orange-600 dark:bg-orange-900/20';
      default: return 'bg-gray-100 text-gray-500 dark:bg-gray-800';
    }
  };

  const isHighPriority = notification.priority === 'High';

  return (
    <div 
      onClick={() => onMarkRead(notification.id)}
      className={`group relative flex flex-col md:flex-row gap-4 p-4 rounded-lg shadow-sm border transition-all cursor-pointer ${
        !notification.isRead 
          ? isHighPriority 
            ? 'bg-red-50 dark:bg-red-900/10 border-l-4 border-l-red-500 border-red-100 dark:border-red-900/40' 
            : 'bg-white dark:bg-[#1c222e] border-transparent hover:border-gray-200 dark:hover:border-gray-700' 
          : 'bg-gray-50/50 dark:bg-[#161b26] border-transparent hover:border-gray-200 dark:hover:border-gray-700 opacity-80'
      } hover:shadow-md`}
    >
      <div className="flex items-start gap-4 flex-1">
        <div className={`flex items-center justify-center rounded-full shrink-0 size-10 md:size-12 ${getIconColor(notification.category)}`}>
          <span className="material-symbols-outlined">{notification.icon}</span>
        </div>
        
        <div className="flex flex-1 flex-col justify-center gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className={`text-[#111318] dark:text-white text-base leading-tight ${!notification.isRead ? 'font-bold' : 'font-medium'}`}>
              {notification.title}
            </p>
            {isHighPriority && (
              <span className="inline-flex items-center rounded-md bg-red-100 dark:bg-red-900/40 px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-300">
                High Priority
              </span>
            )}
          </div>
          <p className="text-[#4b5563] dark:text-gray-300 text-sm leading-normal">
            {notification.content}
          </p>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-[#616f89] dark:text-gray-400 text-xs font-medium">
              {notification.category} • {notification.timestamp}
            </p>
            {notification.actionLabel && (
              <span className="text-primary text-xs font-bold hover:underline">
                {notification.actionLabel}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex md:flex-col items-center md:items-end justify-between md:justify-between shrink-0">
        {!notification.isRead && (
          <div className="size-2.5 bg-primary rounded-full shadow-sm shadow-primary/50"></div>
        )}
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded ml-auto md:ml-0">
          <span className="material-symbols-outlined text-gray-500 text-[20px]">more_vert</span>
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;
