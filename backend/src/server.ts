import { EmailService } from './services/email.service';
import { createApp } from "./app";
import { env } from "./config/env";

const app = createApp();

const server = app.listen(env.port, () => {
  console.log(`=========================================`);
  console.log(`🚀 Career Engine Backend Service Started`);
  console.log(`📡 Port: ${env.port}`);
  console.log(`🌐 Environment: ${env.nodeEnv}`);
  console.log(`🩺 Health check: http://localhost:${env.port}/health`);
  console.log(`=========================================`);
});

// Graceful shutdown handlers
function shutdown(signal: string) {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });

  // Force shutdown after 10s
  setTimeout(() => {
    console.error("Forcing shutdown after timeout...");
    process.exit(1);
  }, 10000);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

export default server;
