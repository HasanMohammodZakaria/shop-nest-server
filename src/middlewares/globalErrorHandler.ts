import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import AppError from '../utils/appError';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorDetails: unknown = undefined;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof ZodError) {
    statusCode = 400;
    message = 'Validation error';
    errorDetails = error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      statusCode = 409;
      message = `Duplicate value for field: ${(error.meta?.target as string[])?.join(', ') ?? 'unknown'}`;
    } else if (error.code === 'P2025') {
      statusCode = 404;
      message = 'Requested resource not found';
    } else {
      statusCode = 400;
      message = 'Database request error';
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    data: null,
    ...(errorDetails ? { errors: errorDetails } : {}),
    ...(process.env.NODE_ENV === 'development' && error instanceof Error
      ? { stack: error.stack }
      : {}),
  });
};

export default globalErrorHandler;