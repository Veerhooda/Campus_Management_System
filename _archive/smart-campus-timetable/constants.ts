
import { EventType, ScheduleEvent, DayInfo } from './types';

export const DAYS: DayInfo[] = [
  { name: 'Monday', shortName: 'MON', date: 23 },
  { name: 'Tuesday', shortName: 'TUE', date: 24 },
  { name: 'Wednesday', shortName: 'WED', date: 25, isToday: true },
  { name: 'Thursday', shortName: 'THU', date: 26 },
  { name: 'Friday', shortName: 'FRI', date: 27 },
];

export const HOURS = [8, 9, 10, 11, 12, 13, 14, 15];

export const MOCK_EVENTS: ScheduleEvent[] = [
  {
    id: '1',
    title: 'Data Structures',
    type: EventType.LECTURE,
    startTime: '09:00',
    endTime: '10:30',
    location: 'Room 304',
    dayIndex: 0
  },
  {
    id: '2',
    title: 'Operating Systems',
    type: EventType.LAB,
    startTime: '13:00',
    endTime: '14:30',
    location: 'Lab B',
    dayIndex: 0
  },
  {
    id: '3',
    title: 'Web Development',
    type: EventType.WORKSHOP,
    startTime: '10:00',
    endTime: '12:00',
    location: 'Room 102',
    instructor: 'Prof. Sarah J.',
    dayIndex: 1
  },
  {
    id: '4',
    title: 'Database Systems',
    type: EventType.LECTURE,
    startTime: '09:00',
    endTime: '11:00',
    location: 'Hall A',
    isLive: true,
    dayIndex: 2
  },
  {
    id: '5',
    title: 'Study Group',
    type: EventType.OTHER,
    startTime: '13:00',
    endTime: '14:00',
    location: 'Library Level 2',
    dayIndex: 2
  },
  {
    id: '6',
    title: 'Computer Networks',
    type: EventType.EXAM,
    startTime: '14:00',
    endTime: '15:30',
    location: 'Room 201',
    dayIndex: 3
  },
  {
    id: '7',
    title: 'Software Engineering',
    type: EventType.LECTURE,
    startTime: '10:00',
    endTime: '11:30',
    location: 'Auditorium',
    dayIndex: 4
  }
];

export const TYPE_COLORS: Record<EventType, string> = {
  [EventType.LECTURE]: 'blue',
  [EventType.LAB]: 'indigo',
  [EventType.WORKSHOP]: 'emerald',
  [EventType.EXAM]: 'rose',
  [EventType.OTHER]: 'gray'
};
