
export enum NavItem {
  Dashboard = 'Dashboard',
  Courses = 'Courses',
  Schedule = 'Schedule',
  Grades = 'Grades',
  Library = 'Library',
  Settings = 'Settings'
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  category: 'Academic' | 'System' | 'Events';
  timeAgo: string;
  icon: string;
  iconColor: string;
  bgColor: string;
}

export interface Stat {
  label: string;
  value: string | number;
  subtext?: string;
  status?: string;
  icon: string;
  colorClass: string;
  bgClass: string;
  badge?: string;
}
