import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env";
import { requestLogger } from "./middleware/logger.middleware";
import { errorMiddleware } from "./middleware/error.middleware";
import { notFoundMiddleware } from "./middleware/notFound.middleware";
import apiRoutes from "./routes";
import { HealthController } from "./controllers/health.controller";

export function createApp(): Express {
  const app = express();

  // Security headers
  app.use(helmet());

    // CORS configuration
  const allowedOrigins = [
    env.clientUrl,
    "http://localhost:3000",
    "http://localhost:5173",
  ].filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        if (
          !origin ||
          allowedOrigins.includes(origin) ||
          origin.endsWith('.vercel.app') ||
          origin.endsWith('.onrender.com')
        ) {
          callback(null, true);
        } else {
          // Allow client in production
          callback(null, true);
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // Request body parsing
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Logging
  app.use(requestLogger);

  // Direct root health check (GET /health)
  app.get("/health", HealthController.getHealth);

  // API router mount (e.g. /api/health)
  app.use("/api", apiRoutes);

  // Fallthrough 404 handler
  app.use(notFoundMiddleware);

  // Global error handler
  app.use(errorMiddleware);

  return app;
}
