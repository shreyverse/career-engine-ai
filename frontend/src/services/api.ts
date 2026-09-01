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
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl !== '/api') {
    const clean = envUrl.replace(/\/+$/, '');
    return clean.endsWith('/api') ? clean : `${clean}/api`;
  }

  // Automatic fallback for Render deployments
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname.includes('onrender.com')) {
      return 'https://career-engine-ai.onrender.com/api';
    }
  }

  return '/api';
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

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (netErr: any) {
    const err: any = new Error("Unable to connect to Career Engine backend. The server may be waking up, please try again in a few seconds.");
    err.code = "NETWORK_ERROR";
    throw err;
  }

  const rawText = await response.text();
  let json: ApiResponse<T>;

  try {
    json = JSON.parse(rawText);
  } catch {
    if (response.status === 404) {
      throw new Error(`Backend endpoint not found (${response.status}). Please check API URL configuration.`);
    }
    if (response.status >= 500) {
      throw new Error("Backend service is initializing. Please wait a moment and try again.");
    }
    throw new Error(`Unexpected response from server (${response.status}): ${rawText.slice(0, 100)}`);
  }

  if (!response.ok || json.success === false) {
    const errorMsg = json.error?.message || (json as any).message || `Request failed with status ${response.status}`;
    const err: any = new Error(errorMsg);
    err.code = json.error?.code || "API_ERROR";
    err.status = response.status;
    throw err;
  }

  return json.data as T;
}

export async function apiUploadRequest<T = any>(
  endpoint: string,
  formData: FormData
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem("career_engine_token");
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
    });
  } catch (netErr: any) {
    const err: any = new Error("Unable to connect to Career Engine backend. The server may be waking up, please try again in a few seconds.");
    err.code = "NETWORK_ERROR";
    throw err;
  }

  const rawText = await response.text();
  let json: ApiResponse<T>;

  try {
    json = JSON.parse(rawText);
  } catch {
    if (response.status === 404) {
      throw new Error(`Backend endpoint not found (${response.status}). Please check API URL configuration.`);
    }
    if (response.status >= 500) {
      throw new Error("Backend service is initializing. Please wait a moment and try again.");
    }
    throw new Error(`Unexpected server response (${response.status})`);
  }

  if (!response.ok || json.success === false) {
    const errorMsg = json.error?.message || (json as any).message || `Request failed with status ${response.status}`;
    const err: any = new Error(errorMsg);
    err.code = json.error?.code || "API_ERROR";
    err.status = response.status;
    throw err;
  }

  return json;
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

