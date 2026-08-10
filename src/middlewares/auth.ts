import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt';
import AppError from '../utils/appError';


/**
 * Usage:
 *   router.get('/me', auth(), controller.getMe)                // any logged-in user
 *   router.delete('/:id', auth('ADMIN'), controller.remove)     // admin only
 */
const auth = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError(401, 'You are not authorized. Please login.'));
    }

    const token = authHeader.split(' ')[1];
    let decoded;

    try {
      decoded = verifyToken(token);
    } catch (error) {
      return next(new AppError(401, 'Invalid or expired token. Please login again.'));
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
      return next(new AppError(403, 'You do not have permission to access this resource.'));
    }

    req.user = decoded;
    next();
  };
};

export default auth;