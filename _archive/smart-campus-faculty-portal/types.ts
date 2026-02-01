
export interface User {
  name: string;
  role: string;
  avatar: string;
}

export interface ClassSession {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  status: 'Completed' | 'Now' | 'Upcoming';
}

export interface Submission {
  id: string;
  studentName: string;
  studentAvatar?: string;
  assignmentTitle: string;
  timeAgo: string;
  initials?: string;
  verified?: boolean;
}

export interface ActionItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  actionLabel?: string;
}

export enum NavItem {
  Dashboard = 'Dashboard',
  MyClasses = 'My Classes',
  Students = 'Students',
  Gradebook = 'Gradebook',
  Calendar = 'Calendar',
  Settings = 'Settings'
}
