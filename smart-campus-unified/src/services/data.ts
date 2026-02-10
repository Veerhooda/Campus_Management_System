import api, { ApiResponse } from './api';
import { TimetableSlot, AttendanceRecord, Notification, Student, Grievance, CampusEvent, PaginatedResponse, MaintenanceTicket, User } from '../types';

// Teacher profile type
interface TeacherProfile {
  id: string;
  userId: string;
  departmentId: string;
}

// Student profile type
interface StudentProfile {
  id: string;
  userId: string;
  classId: string;
  rollNumber: string;
}

// Timetable service
export const timetableService = {
  getStudentTimetable: async (): Promise<TimetableSlot[]> => {
    try {
      const profileRes = await api.get<ApiResponse<StudentProfile>>('/students/me');
      const classId = profileRes.data?.data?.classId;
      if (!classId) { console.warn('Student profile or classId not found'); return []; }
      const response = await api.get<ApiResponse<Record<string, TimetableSlot[]>>>(`/timetable/class/${classId}`);
      const grouped = response.data?.data;
      if (!grouped || typeof grouped !== 'object') return [];
      return Object.values(grouped).flat();
    } catch (err) { console.error('Failed to load student timetable:', err); return []; }
  },

  getTeacherTimetable: async (): Promise<TimetableSlot[]> => {
    try {
      const profileRes = await api.get<ApiResponse<TeacherProfile>>('/teachers/me');
      const teacherId = profileRes.data?.data?.id;
      if (!teacherId) { console.warn('Teacher profile not found'); return []; }
      const response = await api.get<ApiResponse<Record<string, TimetableSlot[]>>>(`/timetable/teacher/${teacherId}`);
      const grouped = response.data?.data;
      if (!grouped || typeof grouped !== 'object') return [];
      // Backend returns slots grouped by day — flatten into a flat array
      return Object.values(grouped).flat();
    } catch (err) { console.error('Failed to load teacher timetable:', err); return []; }
  },

  getTimetableByClass: async (classId: string): Promise<TimetableSlot[]> => {
    try {
      const response = await api.get<ApiResponse<Record<string, TimetableSlot[]>>>(`/timetable/class/${classId}`);
      const grouped = response.data?.data;
      if (!grouped || typeof grouped !== 'object') return [];
      return Object.values(grouped).flat();
    } catch (err) { console.error('Failed to load class timetable:', err); return []; }
  },

  getAllSlots: async (page = 1, limit = 20): Promise<PaginatedResponse<TimetableSlot>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<TimetableSlot>>>('/timetable', { params: { page, limit } });
    return response.data.data;
  },
};

// Attendance service
export const attendanceService = {
  getMyAttendance: async (): Promise<{ records: AttendanceRecord[]; stats: { percentage: number; present: number; absent: number; total: number } }> => {
    const response = await api.get<ApiResponse<any>>('/attendance/me');
    return response.data.data;
  },

  getClassAttendance: async (classId: string, date: string): Promise<AttendanceRecord[]> => {
    const response = await api.get<ApiResponse<AttendanceRecord[]>>(`/attendance/class/${classId}`, { params: { date } });
    return response.data.data;
  },

  markBulkAttendance: async (records: Array<{ studentId: string; timetableSlotId: string; date: string; status: string }>): Promise<void> => {
    await api.post('/attendance/bulk', { records });
  },
};

// Notification service
export const notificationService = {
  getNotifications: async (page = 1, limit = 20, type?: string): Promise<PaginatedResponse<Notification>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Notification>>>('/notifications', { params: { page, limit, type } });
    return response.data.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await api.get<ApiResponse<{ count: number }>>('/notifications/unread-count');
    return response.data.data.count;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.post(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.post('/notifications/read-all');
  },

  create: async (data: { title: string; message: string; type?: string; userId: string }): Promise<Notification> => {
    const response = await api.post<ApiResponse<Notification>>('/notifications', data);
    return response.data.data;
  },

  createBulk: async (data: { title: string; message: string; type?: string; userIds: string[] }): Promise<void> => {
    await api.post('/notifications/bulk', data);
  },

  deleteNotification: async (id: string): Promise<void> => {
    await api.delete(`/notifications/${id}`);
  },

  deleteAllRead: async (): Promise<void> => {
    await api.delete('/notifications/read');
  },
};

// Student service
export const studentService = {
  getStudents: async (page = 1, limit = 20, classId?: string): Promise<PaginatedResponse<Student>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Student>>>('/students', { params: { page, limit, classId } });
    return response.data.data;
  },

  getStudentsByClass: async (classId: string): Promise<Student[]> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Student>>>(`/students/class/${classId}`);
    return response.data.data?.data || [];
  },
};

// Grievance service
export const grievanceService = {
  getGrievances: async (page = 1, limit = 20, status?: string): Promise<PaginatedResponse<Grievance>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Grievance>>>('/grievances', { params: { page, limit, status } });
    return response.data.data;
  },

  getMyGrievances: async (page = 1, limit = 20): Promise<PaginatedResponse<Grievance>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Grievance>>>('/grievances/my', { params: { page, limit } });
    return response.data.data;
  },

  createGrievance: async (data: { title: string; description: string; category: string }): Promise<Grievance> => {
    const response = await api.post<ApiResponse<Grievance>>('/grievances', data);
    return response.data.data;
  },

  updateStatus: async (id: string, status: string, resolution?: string): Promise<Grievance> => {
    const response = await api.patch<ApiResponse<Grievance>>(`/grievances/${id}`, { status, resolution });
    return response.data.data;
  },

  resolve: async (id: string, resolution: string): Promise<Grievance> => {
    const response = await api.post<ApiResponse<Grievance>>(`/grievances/${id}/resolve`, { resolution });
    return response.data.data;
  },
};

// Event service
export const eventService = {
  getEvents: async (page = 1, limit = 20, status?: string): Promise<PaginatedResponse<CampusEvent>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<CampusEvent>>>('/events', { params: { page, limit, status } });
    return response.data.data;
  },

  getMyEvents: async (): Promise<CampusEvent[]> => {
    const response = await api.get<ApiResponse<CampusEvent[]>>('/events/my-events');
    return response.data.data;
  },

  getUpcoming: async (page = 1, limit = 20): Promise<PaginatedResponse<CampusEvent>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<CampusEvent>>>('/events/upcoming', { params: { page, limit } });
    return response.data.data;
  },

  createEvent: async (data: { title: string; description?: string; startDate: string; endDate: string; venue?: string; maxParticipants?: number }): Promise<CampusEvent> => {
    const response = await api.post<ApiResponse<CampusEvent>>('/events', data);
    return response.data.data;
  },

  updateEvent: async (id: string, data: Partial<CampusEvent>): Promise<CampusEvent> => {
    const response = await api.patch<ApiResponse<CampusEvent>>(`/events/${id}`, data);
    return response.data.data;
  },

  publishEvent: async (id: string): Promise<CampusEvent> => {
    const response = await api.post<ApiResponse<CampusEvent>>(`/events/${id}/publish`);
    return response.data.data;
  },

  cancelEvent: async (id: string): Promise<CampusEvent> => {
    const response = await api.post<ApiResponse<CampusEvent>>(`/events/${id}/cancel`);
    return response.data.data;
  },

  register: async (eventId: string): Promise<void> => {
    await api.post(`/events/${eventId}/register`);
  },

  unregister: async (eventId: string): Promise<void> => {
    await api.delete(`/events/${eventId}/register`);
  },
};

// User service (admin)
export const userService = {
  getUsers: async (page = 1, limit = 20): Promise<PaginatedResponse<User>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<User>>>('/users', { params: { page, limit } });
    return response.data.data;
  },

  getUsersByRole: async (role: string, page = 1, limit = 20): Promise<PaginatedResponse<User>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<User>>>(`/users/role/${role}`, { params: { page, limit } });
    return response.data.data;
  },

  createUser: async (data: { email: string; password: string; firstName: string; lastName: string; phone?: string; roles: string[] }): Promise<User> => {
    const response = await api.post<ApiResponse<User>>('/users', data);
    return response.data.data;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await api.patch<ApiResponse<User>>(`/users/${id}`, data);
    return response.data.data;
  },

  deactivateUser: async (id: string): Promise<void> => {
    await api.patch(`/users/${id}/deactivate`);
  },

  reactivateUser: async (id: string): Promise<void> => {
    await api.patch(`/users/${id}/reactivate`);
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

// Maintenance service
export const maintenanceService = {
  getAll: async (page = 1, limit = 20, status?: string): Promise<PaginatedResponse<MaintenanceTicket>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<MaintenanceTicket>>>('/maintenance', { params: { page, limit, status } });
    return response.data.data;
  },

  getMyTickets: async (page = 1, limit = 20): Promise<PaginatedResponse<MaintenanceTicket>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<MaintenanceTicket>>>('/maintenance/my', { params: { page, limit } });
    return response.data.data;
  },

  create: async (data: { title: string; description: string; location?: string; priority?: string }): Promise<MaintenanceTicket> => {
    const response = await api.post<ApiResponse<MaintenanceTicket>>('/maintenance', data);
    return response.data.data;
  },

  resolve: async (id: string, resolution: string): Promise<MaintenanceTicket> => {
    const response = await api.post<ApiResponse<MaintenanceTicket>>(`/maintenance/${id}/resolve`, { resolution });
    return response.data.data;
  },
};

// File / Notes service
export interface FileRecord {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  subjectId?: string;
  subject?: { id: string; name: string; code: string };
  uploadedBy?: { user?: { firstName: string; lastName: string } };
  createdAt: string;
}

export const fileService = {
  upload: async (file: File, subjectId?: string): Promise<FileRecord> => {
    const formData = new FormData();
    formData.append('file', file);
    const params = subjectId ? `?subjectId=${subjectId}` : '';
    const response = await api.post<ApiResponse<FileRecord>>(`/files/upload${params}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  getMyFiles: async (page = 1, limit = 20): Promise<PaginatedResponse<FileRecord>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<FileRecord>>>('/files/my', { params: { page, limit } });
    return response.data.data;
  },

  getAll: async (page = 1, limit = 50): Promise<PaginatedResponse<FileRecord>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<FileRecord>>>('/files/all', { params: { page, limit } });
    return response.data.data;
  },

  getBySubject: async (subjectId: string, page = 1, limit = 20): Promise<PaginatedResponse<FileRecord>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<FileRecord>>>(`/files/subject/${subjectId}`, { params: { page, limit } });
    return response.data.data;
  },

  getDownloadUrl: (fileId: string): string => {
    const baseUrl = api.defaults.baseURL || '';
    return `${baseUrl}/files/${fileId}/download`;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/files/${id}`);
  },
};
