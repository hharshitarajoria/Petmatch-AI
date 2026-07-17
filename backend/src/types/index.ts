export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data?: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  stack?: string;
}

export interface HealthCheckData {
  status: 'ok';
  uptime: number;
  timestamp: string;
  environment: string;
}
