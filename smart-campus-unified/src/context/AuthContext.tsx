import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, UserRole } from '../types';
import { authService, tokenManager, getErrorMessage } from '../services';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'ait_campus_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      // Check if we have tokens
      if (tokenManager.hasTokens()) {
        // Try to restore user from storage first (faster)
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            // Invalid stored user
          }
        }

        // Verify tokens are still valid by fetching current user
        try {
          const authUser = await authService.getMe();
          const userData: User = {
            id: authUser.id,
            email: authUser.email,
            firstName: authUser.firstName,
            lastName: authUser.lastName,
            roles: authUser.roles,
          };
          setUser(userData);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
        } catch {
          // Token invalid, clear everything
          tokenManager.clearTokens();
          localStorage.removeItem(USER_STORAGE_KEY);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login({ email, password });
      
      const userData: User = {
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        roles: response.user.roles,
      };

      setUser(userData);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      localStorage.removeItem(USER_STORAGE_KEY);
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout,
      error,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper to get primary role (for routing)
export const getPrimaryRole = (roles: UserRole[]): UserRole => {
  // Priority: ADMIN > TEACHER > ORGANIZER > STUDENT
  if (roles.includes('ADMIN')) return 'ADMIN';
  if (roles.includes('TEACHER')) return 'TEACHER';
  if (roles.includes('ORGANIZER')) return 'ORGANIZER';
  return 'STUDENT';
};

// Helper to get display name
export const getDisplayName = (user: User | null): string => {
  if (!user) return 'User';
  return `${user.firstName} ${user.lastName}`.trim() || user.email;
};
