import { Request, Response, NextFunction } from 'express';
import { isProduction } from '../config/env';
import { logger } from '../utils/logger';
import { ApiErrorResponse } from '../types';

export interface AppError extends Error {
  statusCode?: number;
}

// Must keep four params for Express to recognize this as an error handler.
export function errorHandler(
  err: AppError,
  req: Request,
  res: Response<ApiErrorResponse>,
  _next: NextFunction
): void {
  const statusCode = err.statusCode ?? 500;

  logger.error(`${req.method} ${req.originalUrl} - ${err.message}`, {
    stack: err.stack,
  });

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(isProduction ? {} : { stack: err.stack }),
  });
}
