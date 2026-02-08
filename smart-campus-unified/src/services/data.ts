import api, { ApiResponse } from './api';
import { TimetableSlot, AttendanceRecord, Notification, Student, Grievance, CampusEvent, PaginatedResponse } from '../types';

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
  // Get timetable slots for the current student
  getStudentTimetable: async (): Promise<TimetableSlot[]> => {
    try {
      // First get student profile to get classId
      const profileRes = await api.get<ApiResponse<StudentProfile>>('/students/me');
      const classId = profileRes.data?.data?.classId;
      
      if (!classId) {
        console.warn('Student profile or classId not found');
        return [];
      }
      
      // Then get timetable by class
      const response = await api.get<ApiResponse<TimetableSlot[]>>(`/timetable/class/${classId}`);
      return response.data?.data || [];
    } catch (err) {
      console.error('Failed to load student timetable:', err);
      return [];
    }
  },

  // Get timetable slots for the current teacher
  getTeacherTimetable: async (): Promise<TimetableSlot[]> => {
    try {
      // First get teacher profile to get teacherId
      const profileRes = await api.get<ApiResponse<TeacherProfile>>('/teachers/me');
      const teacherId = profileRes.data?.data?.id;
      
      if (!teacherId) {
        console.warn('Teacher profile not found');
        return [];
      }
      
      // Then get timetable by teacher
      const response = await api.get<ApiResponse<TimetableSlot[]>>(`/timetable/teacher/${teacherId}`);
      return response.data?.data || [];
    } catch (err) {
      console.error('Failed to load teacher timetable:', err);
      return [];
    }
  },

  // Get timetable by class (for attendance)
  getTimetableByClass: async (classId: string): Promise<TimetableSlot[]> => {
    try {
      const response = await api.get<ApiResponse<TimetableSlot[]>>(`/timetable/class/${classId}`);
      return response.data?.data || [];
    } catch (err) {
      console.error('Failed to load class timetable:', err);
      return [];
    }
  },

  // Get all timetable slots (admin)
  getAllSlots: async (page = 1, limit = 20): Promise<PaginatedResponse<TimetableSlot>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<TimetableSlot>>>('/timetable', {
      params: { page, limit },
    });
    return response.data.data;
  },
};

// Attendance service
export const attendanceService = {
  // Get my attendance (student)
  getMyAttendance: async (): Promise<{ records: AttendanceRecord[]; stats: { percentage: number; present: number; absent: number; total: number } }> => {
    const response = await api.get<ApiResponse<any>>('/attendance/me');
    return response.data.data;
  },

  // Get attendance for a class on a date (teacher)
  getClassAttendance: async (classId: string, date: string): Promise<AttendanceRecord[]> => {
    const response = await api.get<ApiResponse<AttendanceRecord[]>>(`/attendance/class/${classId}`, {
      params: { date },
    });
    return response.data.data;
  },

  // Mark attendance in bulk
  markBulkAttendance: async (records: Array<{ studentId: string; timetableSlotId: string; date: string; status: string }>): Promise<void> => {
    await api.post('/attendance/bulk', { records });
  },
};

// Notification service
export const notificationService = {
  // Get notifications with pagination
  getNotifications: async (page = 1, limit = 20, type?: string): Promise<PaginatedResponse<Notification>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Notification>>>('/notifications', {
      params: { page, limit, type },
    });
    return response.data.data;
  },

  // Get unread count
  getUnreadCount: async (): Promise<number> => {
    const response = await api.get<ApiResponse<{ count: number }>>('/notifications/unread-count');
    return response.data.data.count;
  },

  // Mark as read
  markAsRead: async (id: string): Promise<void> => {
    await api.post(`/notifications/${id}/read`);
  },

  // Mark all as read
  markAllAsRead: async (): Promise<void> => {
    await api.post('/notifications/read-all');
  },
};

// Student service
export const studentService = {
  // Get students with optional filters
  getStudents: async (page = 1, limit = 20, classId?: string): Promise<PaginatedResponse<Student>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Student>>>('/students', {
      params: { page, limit, classId },
    });
    return response.data.data;
  },

  // Get students in a class
  getStudentsByClass: async (classId: string): Promise<Student[]> => {
    const response = await api.get<ApiResponse<Student[]>>(`/students/class/${classId}`);
    return response.data.data;
  },
};

// Grievance service
export const grievanceService = {
  // Get grievances with pagination
  getGrievances: async (page = 1, limit = 20, status?: string): Promise<PaginatedResponse<Grievance>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Grievance>>>('/grievances', {
      params: { page, limit, status },
    });
    return response.data.data;
  },

  // Get my grievances
  getMyGrievances: async (): Promise<Grievance[]> => {
    const response = await api.get<ApiResponse<Grievance[]>>('/grievances/me');
    return response.data.data;
  },

  // Create grievance
  createGrievance: async (data: { title: string; description: string; category: string }): Promise<Grievance> => {
    const response = await api.post<ApiResponse<Grievance>>('/grievances', data);
    return response.data.data;
  },

  // Update grievance status
  updateStatus: async (id: string, status: string, resolution?: string): Promise<Grievance> => {
    const response = await api.patch<ApiResponse<Grievance>>(`/grievances/${id}`, { status, resolution });
    return response.data.data;
  },
};

// Event service
export const eventService = {
  // Get events with pagination
  getEvents: async (page = 1, limit = 20, status?: string): Promise<PaginatedResponse<CampusEvent>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<CampusEvent>>>('/events', {
      params: { page, limit, status },
    });
    return response.data.data;
  },

  // Get my events (organizer)
  getMyEvents: async (): Promise<CampusEvent[]> => {
    const response = await api.get<ApiResponse<CampusEvent[]>>('/events/my-events');
    return response.data.data;
  },

  // Get upcoming events
  getUpcoming: async (page = 1, limit = 20): Promise<PaginatedResponse<CampusEvent>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<CampusEvent>>>('/events/upcoming', {
      params: { page, limit },
    });
    return response.data.data;
  },

  // Create event
  createEvent: async (data: { title: string; description?: string; startDate: string; endDate: string; venue?: string; maxParticipants?: number }): Promise<CampusEvent> => {
    const response = await api.post<ApiResponse<CampusEvent>>('/events', data);
    return response.data.data;
  },

  // Update event
  updateEvent: async (id: string, data: Partial<CampusEvent>): Promise<CampusEvent> => {
    const response = await api.patch<ApiResponse<CampusEvent>>(`/events/${id}`, data);
    return response.data.data;
  },

  // Publish event
  publishEvent: async (id: string): Promise<CampusEvent> => {
    const response = await api.post<ApiResponse<CampusEvent>>(`/events/${id}/publish`);
    return response.data.data;
  },

  // Cancel event
  cancelEvent: async (id: string): Promise<CampusEvent> => {
    const response = await api.post<ApiResponse<CampusEvent>>(`/events/${id}/cancel`);
    return response.data.data;
  },

  // Register for event
  register: async (eventId: string): Promise<void> => {
    await api.post(`/events/${eventId}/register`);
  },

  // Unregister from event
  unregister: async (eventId: string): Promise<void> => {
    await api.delete(`/events/${eventId}/register`);
  },
};

// User service (admin)
export const userService = {
  // Get user counts
  getCounts: async (): Promise<{ students: number; teachers: number; admins: number; total: number }> => {
    const response = await api.get<ApiResponse<any>>('/users/counts');
    return response.data.data;
  },
};
