
export type NotificationCategory = 'All' | 'Unread' | 'Academic' | 'Events' | 'System' | 'Community';

export interface Notification {
  id: string;
  title: string;
  content: string;
  category: NotificationCategory;
  timestamp: string;
  isRead: boolean;
  priority?: 'High' | 'Normal';
  actionLabel?: string;
  icon: string;
}

export interface User {
  name: string;
  avatar: string;
}
