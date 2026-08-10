import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an async controller so rejected promises are forwarded to
 * the global error handler instead of crashing the process.
 */
const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default catchAsync;