
export enum AttendanceStatus {
  PRESENT = 'Present',
  LATE = 'Late',
  ABSENT = 'Absent'
}

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  avatarUrl?: string;
  attendancePercentage: number;
  status: AttendanceStatus;
}

export interface FilterOptions {
  course: string;
  section: string;
  session: string;
}
