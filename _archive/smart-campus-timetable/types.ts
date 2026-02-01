
export enum EventType {
  LECTURE = 'Lecture',
  LAB = 'Lab',
  WORKSHOP = 'Workshop',
  EXAM = 'Exam/Quiz',
  OTHER = 'Study Group'
}

export interface ScheduleEvent {
  id: string;
  title: string;
  type: EventType;
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  location: string;
  instructor?: string;
  isLive?: boolean;
  dayIndex: number; // 0-4 (Mon-Fri)
}

export interface DayInfo {
  name: string;
  shortName: string;
  date: number;
  isToday?: boolean;
}
