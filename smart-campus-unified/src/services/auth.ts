import api, { ApiResponse, tokenManager, getErrorMessage } from './api';

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
  studentProfile?: {
    id: string;
    rollNumber: string;
    registrationNumber?: string;
    enrollmentYear: number;
    classId: string;
  };
  teacherProfile?: {
    id: string;
    employeeId: string;
    departmentId: string;
  };
}

export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN' | 'ORGANIZER';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

// Auth service
export const authService = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    const { accessToken, refreshToken } = response.data.data;
    
    // Store tokens
    tokenManager.setTokens(accessToken, refreshToken);
    
    return response.data.data;
  },

  /**
   * Logout - clear tokens and call logout endpoint
   */
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore errors on logout
    } finally {
      tokenManager.clearTokens();
    }
  },

  /**
   * Get current user profile
   */
  getMe: async (): Promise<AuthUser> => {
    const response = await api.post<ApiResponse<AuthUser>>('/auth/me');
    return response.data.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (): Promise<AuthTokens> => {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post<ApiResponse<AuthTokens>>('/auth/refresh', { refreshToken });
    const tokens = response.data.data;
    
    tokenManager.setTokens(tokens.accessToken, tokens.refreshToken);
    
    return tokens;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return tokenManager.hasTokens();
  },
};

export { getErrorMessage };
export default authService;
