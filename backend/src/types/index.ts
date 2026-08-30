export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

export interface HealthResponse {
  status: "ok" | "degraded" | "error";
  service: string;
  version?: string;
  timestamp?: string;
  environment?: string;
  uptimeSeconds?: number;
}
