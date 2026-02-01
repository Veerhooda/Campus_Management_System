
export interface EventData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  isAllDay: boolean;
  building: string;
  room: string;
  audience: string[];
  bannerUrl: string | null;
}

export enum FormStep {
  BASIC_DETAILS = 1,
  VENUE_LOGISTICS = 2
}

export interface Building {
  id: string;
  name: string;
  rooms: Room[];
}

export interface Room {
  id: string;
  name: string;
  hasConflict?: boolean;
  conflictDetails?: string;
}
