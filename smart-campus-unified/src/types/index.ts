// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
  phone?: string;
  avatar?: string;
  studentProfile?: {
    id: string;
    rollNumber: string;
    registrationNumber?: string;
    enrollmentYear: number;
    classId: string;
  };
  teacherProfile?: {
    id: string;
    employeeId: string;
    departmentId: string;
  };
}

// Backend uses uppercase roles
export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN' | 'ORGANIZER';

// Legacy role type for gradual migration (maps to new roles)
export type LegacyRole = 'Student' | 'Faculty' | 'Admin';

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  message?: string;
}

// Pagination meta
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

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
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  userId: string;
}

export type NotificationType = 'GENERAL' | 'ACADEMIC' | 'EVENT' | 'ALERT';
export type NotificationCategory = 'All' | 'Academic' | 'Events' | 'System' | 'Community' | 'Unread';

// Event Types
export interface CampusEvent {
  id: string;
  title: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  venue?: string;
  status: EventStatus;
  maxCapacity?: number;
  organizerId: string;
  posterUrl?: string;
  themeColor?: string;
  isFeedbackEnabled?: boolean;
}

export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';

// Attendance Types
export interface Student {
  id: string;
  rollNumber: string;
  userId: string;
  classId: string;
  enrollmentYear: number;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  timetableSlotId: string;
  date: string;
  status: AttendanceStatus;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

// Grievance/Ticket Types
export interface Grievance {
  id: string;
  title: string;
  description: string;
  category: string;
  status: TicketStatus;
  priority: string;
  submittedById: string;
  assignedToId?: string;
  createdAt: string;
  updatedAt: string;
  resolution?: string;
  submittedBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  assignedTo?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export enum TicketPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical',
}

// Maintenance Request Types
export interface MaintenanceTicket {
  id: string;
  title: string;
  description: string;
  location?: string;
  priority?: string;
  status: TicketStatus;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
  submittedById: string;
  submittedBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

// Timetable Types
export type SlotType = 'LECTURE' | 'LAB' | 'TUTORIAL' | 'SEMINAR';

export interface TimetableSlot {
  id: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  roomId?: string;
  type?: SlotType;
  subject?: {
    name: string;
    code: string;
  };
  teacher?: {
    id: string;
    firstName: string;
    lastName: string;
    user?: {
      firstName: string;
      lastName: string;
    };
  };
  room?: {
    name: string;
    building: string;
  };
  class?: {
    name: string;
  };
}

export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

// Legacy timetable event for UI compatibility
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

// Teacher Profile
export interface Teacher {
  id: string;
  userId: string;
  employeeId: string;
  departmentId?: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

// Class/Section
export interface Class {
  id: string;
  name: string;
  year: number;
  section: string;
  departmentId: string;
}

// Subject
export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  departmentId: string;
}

// Department
export interface Department {
  id: string;
  name: string;
  code: string;
}

// Room
export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  hasProjector: boolean;
}
