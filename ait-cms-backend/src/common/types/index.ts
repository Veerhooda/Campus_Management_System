import { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      roles: Role[];
    }
    
    interface Request {
      user?: User;
    }
  }
}

export interface JwtPayload {
  sub: string;
  email: string;
  roles: Role[];
  type: 'access' | 'refresh';
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
