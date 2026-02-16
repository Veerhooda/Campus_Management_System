import api from './api';
import { ApiResponse } from '../types';

export interface Club {
  id: string;
  name: string;
  description?: string;
  instagram?: string;
  logoUrl?: string;
  bgUrl?: string;
  themeColor?: string;
  members?: ClubMember[];
  organizer?: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  achievements: string[];
}

export interface ClubMember {
  id: string;
  studentId: string;
  student: {
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
    class?: { name: string };
  };
  joinedAt: string;
}

export const clubService = {
  getMyClub: async () => {
    const response = await api.get<ApiResponse<Club>>('/clubs/my-club');
    return response.data.data;
  },

  updateClub: async (data: Partial<Club>) => {
    const response = await api.put<ApiResponse<Club>>('/clubs/my-club', data);
    return response.data.data;
  },

  addMember: async (email: string) => {
    const response = await api.post<ApiResponse<any>>('/clubs/members', { email });
    return response.data.data;
  },

  getMembers: async (): Promise<ClubMember[]> => {
    const response = await api.get<ApiResponse<ClubMember[]>>('/clubs/members');
    return response.data.data;
  },

  // --- Admin Methods ---
  getAllClubs: async (): Promise<Club[]> => {
    const response = await api.get<ApiResponse<Club[]>>('/clubs');
    return response.data.data;
  },

  createClubAdmin: async (data: { name: string; description: string }): Promise<Club> => {
    const response = await api.post<ApiResponse<Club>>('/clubs', data);
    return response.data.data;
  },

  assignOrganizer: async (clubId: string, email: string): Promise<Club> => {
    const response = await api.put<ApiResponse<Club>>(`/clubs/${clubId}/assign`, { email });
    return response.data.data;
  },

  removeMember: async (memberId: string) => {
    const response = await api.delete<ApiResponse<any>>(`/clubs/members/${memberId}`);
    return response.data.data;
  },

  searchStudents: async (query: string) => {
    const response = await api.get<ApiResponse<any[]>>('/clubs/students/search', { params: { q: query } });
    return response.data.data;
  },

  getStudentClubs: async () => {
    const response = await api.get<ApiResponse<any[]>>('/clubs/my-clubs');
    return response.data.data;
  },
};
