
export type UserRole = 'Student' | 'Faculty' | 'Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  time: string;
  room: string;
  instructor: string;
}
