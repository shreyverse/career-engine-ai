import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import { sendError } from "../utils/response";

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export function errorMiddleware(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const code = err.code || "INTERNAL_ERROR";

  // Log error stack trace in development
  if (env.isDevelopment) {
    console.error(`[ERROR] [${req.method} ${req.url}]:`, err);
  }

  const details = env.isDevelopment ? err.stack : undefined;
  sendError(res, message, statusCode, code, details);
}
