
export enum TicketStatus {
  NEW = 'New',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved'
}

export enum TicketPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export type Category = 'HVAC' | 'Plumbing' | 'Electrical' | 'Janitorial' | 'IT Support' | 'General';

export interface Assignee {
  name: string;
  avatarUrl?: string;
}

export interface Ticket {
  id: string;
  category: Category;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignee?: Assignee;
  date: string;
}

export interface Stats {
  totalOpen: number;
  totalOpenTrend: number;
  highPriority: number;
  highPriorityTrend: number;
  unassigned: number;
  unassignedTrend: number;
  resolvedToday: number;
  resolvedTodayTrend: number;
}
