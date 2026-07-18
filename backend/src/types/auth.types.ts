import { UserRole } from '@prisma/client';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: UserRole;
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

// Shape returned to clients — never includes passwordHash.
export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponseData {
  user: PublicUser;
  token: string;
}

// Augment Express's Request so req.user is typed everywhere without casting.
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
