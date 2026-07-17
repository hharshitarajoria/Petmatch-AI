import { Request, Response } from 'express';
import { env } from '../config/env';
import { ApiSuccessResponse, HealthCheckData } from '../types';

export function getHealth(_req: Request, res: Response<ApiSuccessResponse<HealthCheckData>>): void {
  const data: HealthCheckData = {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: env.nodeEnv,
  };

  res.status(200).json({
    success: true,
    message: 'PetMatch AI backend is up and running',
    data,
  });
}
