import AppError from '../utils/appError';
import { Request, Response, NextFunction } from 'express';


/**
 * Use after auth() when you want a readable, explicit admin gate:
 *   router.delete('/:id', auth(), requireAdmin, controller.remove)
 *
 * Equivalent shortcut: auth('ADMIN')
 */
const requireAdmin = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError(401, 'You are not authorized. Please login.'));
  }

  if (req.user.role !== 'ADMIN') {
    return next(new AppError(403, 'Admin access required.'));
  }

  next();
};

export default requireAdmin;