
export enum EventStatus {
  ACTIVE = 'Active',
  UPCOMING = 'Upcoming',
  DRAFT = 'Draft',
  COMPLETED = 'Completed'
}

export interface CampusEvent {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  status: EventStatus;
  imageUrl: string;
}

export interface Deadline {
  id: string;
  title: string;
  dueText: string;
  dueColor: 'orange' | 'slate';
}

export interface Metric {
  label: string;
  value: string;
  trend?: string;
  icon: string;
  colorClass: string;
  bgClass: string;
}
