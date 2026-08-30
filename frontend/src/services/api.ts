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
    message?: string;
  };
}

export interface HealthStatus {
  status: "ok" | "degraded" | "error";
  service: string;
  version?: string;
  timestamp?: string;
  uptimeSeconds?: number;
}

const getApiBase = (): string => {
  const raw = import.meta.env.VITE_API_URL || '/api';
  if (raw === '/api') return '/api';
  const clean = raw.replace(/\/+$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

const API_BASE = getApiBase();

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("career_engine_token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const json: ApiResponse<T> = await response.json();

  if (!response.ok || json.success === false) {
    const errorMsg = json.error?.message || `Request failed with status ${response.status}`;
    const err: any = new Error(errorMsg);
    err.code = json.error?.code || "API_ERROR";
    err.status = response.status;
    throw err;
  }

  return json.data as T;
}

export const apiService = {
  async getHealth(): Promise<HealthStatus> {
    const res = await fetch(`${API_BASE}/health`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      throw new Error(`Health check failed with status ${res.status}`);
    }
    return res.json();
  },
};
