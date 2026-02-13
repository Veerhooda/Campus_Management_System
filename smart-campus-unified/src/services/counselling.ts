
import api from './api';
import { CounsellingSession, ApiResponse } from '../types';

export const counsellingService = {
  // Create a session (Faculty)
  createSession: async (data: Partial<CounsellingSession>) => {
    const response = await api.post<ApiResponse<CounsellingSession>>('/counselling/sessions', data);
    return response.data.data;
  },

  // Get my sessions (Student)
  getMySessions: async () => {
    const response = await api.get<ApiResponse<CounsellingSession[]>>('/counselling/my-sessions');
    return response.data.data;
  },

  // Get sessions logged by me (Counsellor)
  getCounsellorSessions: async () => {
    const response = await api.get<ApiResponse<CounsellingSession[]>>('/counselling/counsellor/sessions');
    return response.data.data;
  },
  
  // Admin: Toggle Counsellor Status
  toggleCounsellor: async (teacherId: string, status: boolean) => {
    const response = await api.patch<ApiResponse<any>>(`/teachers/${teacherId}/counsellor`, { status });
    return response.data.data;
  },

  // Admin: Assign Counsellor to Student
  assignCounsellor: async (studentId: string, counsellorId: string | null) => {
    const response = await api.patch<ApiResponse<any>>(`/students/${studentId}/assign-counsellor`, { counsellorId });
    return response.data.data;
  },

  // Counsellor: Get Mentees
  getMyMentees: async () => {
    const response = await api.get<ApiResponse<any[]>>('/teachers/me/mentees');
    return response.data.data;
  }
};
