import { HealthResponse } from "../types";
import { env } from "../config/env";

export class HealthService {
  public static getHealth(): HealthResponse {
    return {
      status: "ok",
      service: "career-engine-api",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      environment: env.nodeEnv,
      uptimeSeconds: Math.floor(process.uptime()),
    };
  }
}
