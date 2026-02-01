
import { Building } from './types';

export const BUILDINGS: Building[] = [
  {
    id: 'sc',
    name: 'Student Center',
    rooms: [
      { id: 'sc-1', name: 'Conference Room A' },
      { id: 'sc-2', name: 'Student Lounge' }
    ]
  },
  {
    id: 'ml',
    name: 'Main Library',
    rooms: [
      { id: 'ml-1', name: 'Quiet Study Room' },
      { id: 'ml-2', name: 'Grand Auditorium (Conflict)', hasConflict: true, conflictDetails: 'The "Grand Auditorium" is currently booked by "Engineering Orientation" on the selected date.' },
      { id: 'ml-3', name: 'Lecture Hall 101' }
    ]
  },
  {
    id: 'soe',
    name: 'School of Engineering',
    rooms: [
      { id: 'soe-1', name: 'Lab 402' },
      { id: 'soe-2', name: 'Workshop A' }
    ]
  }
];
