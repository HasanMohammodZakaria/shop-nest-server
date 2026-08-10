import { Response } from 'express';

interface Meta {
  page?: number;
  limit?: number;
  total?: number;
}

interface ApiResponsePayload<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Meta;
}

/**
 * Sends every API response in the same consistent shape:
 * { success, message, data, meta? }
 */
const sendResponse = <T>(res: Response, statusCode: number, payload: ApiResponsePayload<T>) => {
  res.status(statusCode).json({
    success: payload.success,
    message: payload.message,
    data: payload.data ?? null,
    ...(payload.meta && { meta: payload.meta }),
  });
};

export default sendResponse;