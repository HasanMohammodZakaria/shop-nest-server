import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";

export const globalErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = "Something went wrong!";

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = 409;
      message = `Duplicate value for field: ${err.meta?.target}`;
    } else if (err.code === "P2025") {
      statusCode = 404;
      message = "Requested record was not found";
    }
  } else if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    data: null,
    stack: process.env.NODE_ENV === "development" && err instanceof Error ? err.stack : undefined,
  });
};