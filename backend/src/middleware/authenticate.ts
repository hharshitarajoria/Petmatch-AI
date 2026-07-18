import { Request, Response, NextFunction } from 'express';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import { verifyToken } from '../utils/jwt';
import { UnauthorizedError, ForbiddenError } from '../utils/httpError';

function extractBearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  return header.slice('Bearer '.length).trim();
}

/**
 * Verifies the JWT on the Authorization header and attaches { id, email, role }
 * to req.user. Throws 401 if the token is missing, malformed, or expired.
 */
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const token = extractBearerToken(req);

  if (!token) {
    next(new UnauthorizedError('Missing or malformed Authorization header'));
    return;
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      next(new UnauthorizedError('Token has expired'));
      return;
    }
    if (error instanceof JsonWebTokenError) {
      next(new UnauthorizedError('Invalid token'));
      return;
    }
    next(error);
  }
}

/**
 * Role-based guard. Use after `authenticate`, e.g.:
 *   router.delete('/pets/:id', authenticate, authorize(UserRole.ADMIN), deletePet)
 */
export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError('Authentication required'));
      return;
    }
    if (!allowedRoles.includes(req.user.role)) {
      next(new ForbiddenError('You do not have permission to perform this action'));
      return;
    }
    next();
  };
}
