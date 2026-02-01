// User and Authentication Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export type UserRole = 'Student' | 'Faculty' | 'Admin';

// Navigation Types
export interface NavItem {
  icon: string;
  label: string;
  path: string;
  roles?: UserRole[];
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  content: string;
  category: NotificationCategory;
  timestamp: string;
  isRead: boolean;
  priority?: 'Low' | 'Medium' | 'High';
  actionLabel?: string;
  icon: string;
}

export type NotificationCategory = 'All' | 'Academic' | 'Events' | 'System' | 'Community' | 'Unread';

// Event Types
export interface CampusEvent {
  id: string;
  name: string;
  description?: string;
  date: string;
  time: string;
  venue: string;
  status: EventStatus;
  imageUrl?: string;
}

export enum EventStatus {
  DRAFT = 'Draft',
  UPCOMING = 'Upcoming',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

// Attendance Types
export interface Student {
  id: string;
  rollNo: string;
  name: string;
  avatarUrl?: string;
  status: AttendanceStatus;
  attendancePercentage: number;
}

export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent',
  LATE = 'Late',
  NOT_MARKED = 'Not Marked',
}

// Grievance/Ticket Types
export interface Ticket {
  id: string;
  category: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  date: string;
  assignee?: {
    name: string;
    avatarUrl: string;
  };
}

export enum TicketPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical',
}

export enum TicketStatus {
  NEW = 'New',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
}

// Timetable Types
export interface TimetableEvent {
  id: string;
  title: string;
  type: EventType;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  instructor?: string;
}

export type EventType = 'Lecture' | 'Lab' | 'Tutorial' | 'Exam' | 'Other';

// Metric/Stats Types
export interface Metric {
  label: string;
  value: string | number;
  trend?: string;
  icon: string;
  colorClass?: string;
  bgClass?: string;
}

// Deadline Types
export interface Deadline {
  id: string;
  title: string;
  dueText: string;
  dueColor: string;
}
