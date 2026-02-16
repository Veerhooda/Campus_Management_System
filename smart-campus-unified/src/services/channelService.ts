import api from './api';
import { ApiResponse } from '../types';

export interface Channel {
  id: string;
  name: string;
  description?: string;
  clubId: string;
  club?: {
    id: string;
    name: string;
    logoUrl?: string;
    themeColor?: string;
  };
  _count?: {
    members: number;
    messages: number;
  };
  members?: ChannelMemberInfo[];
  createdAt: string;
}

export interface ChannelMemberInfo {
  id: string;
  student: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  joinedAt: string;
}

export interface ChannelMessage {
  id: string;
  content: string;
  channelId: string;
  senderId: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
}

export const channelService = {
  // --- Organizer ---
  createChannel: async (name: string, description?: string): Promise<Channel> => {
    const response = await api.post<ApiResponse<Channel>>('/channels', { name, description });
    return response.data.data;
  },

  getClubChannels: async (): Promise<Channel[]> => {
    const response = await api.get<ApiResponse<Channel[]>>('/channels/club');
    return response.data.data;
  },

  addChannelMember: async (channelId: string, studentId: string) => {
    const response = await api.post<ApiResponse<any>>(`/channels/${channelId}/members`, { studentId });
    return response.data.data;
  },

  removeChannelMember: async (channelId: string, memberId: string) => {
    const response = await api.delete<ApiResponse<any>>(`/channels/${channelId}/members/${memberId}`);
    return response.data.data;
  },

  deleteChannel: async (channelId: string) => {
    const response = await api.delete<ApiResponse<any>>(`/channels/${channelId}`);
    return response.data.data;
  },

  // --- Student ---
  getMyChannels: async (): Promise<{ channel: Channel }[]> => {
    const response = await api.get<ApiResponse<{ channel: Channel }[]>>('/channels/my-channels');
    return response.data.data;
  },

  // --- Shared ---
  getMessages: async (channelId: string, page = 1, limit = 50) => {
    const response = await api.get<ApiResponse<{ data: ChannelMessage[]; meta: any }>>(`/channels/${channelId}/messages`, { params: { page, limit } });
    return response.data.data;
  },

  sendMessage: async (channelId: string, content: string): Promise<ChannelMessage> => {
    const response = await api.post<ApiResponse<ChannelMessage>>(`/channels/${channelId}/messages`, { content });
    return response.data.data;
  },
};
