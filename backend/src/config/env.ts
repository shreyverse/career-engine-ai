import dotenv from "dotenv";
import path from "path";

// Load root or local .env
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config();

export interface EnvironmentConfig {
  port: number;
  nodeEnv: string;
  clientUrl: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  geminiApiKey?: string;
  geminiModel: string;
  googleClientId?: string;
  googleClientSecret?: string;
  isProduction: boolean;
  isDevelopment: boolean;
}

export const env: EnvironmentConfig = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  jwtSecret: process.env.JWT_SECRET || "career_engine_super_secret_jwt_key_2026",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  geminiApiKey: process.env.GEMINI_API_KEY || undefined,
  geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  googleClientId: process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || undefined,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || undefined,
  isProduction: (process.env.NODE_ENV || "development") === "production",
  isDevelopment: (process.env.NODE_ENV || "development") === "development",
};

