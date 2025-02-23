import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../.env");

export function setupEnvironment() {
  // Only load .env file in development
  if (process.env.NODE_ENV !== "production") {
    const result = dotenv.config({ path: envPath });
    if (result.error) {
      console.warn(`Warning: ${result.error.message}`);
    }
  }

  // Check required environment variables
  const requiredEnvVars = [
    "GOOGLE_API_KEY",
    "REASON_MODEL_API_KEY",
    "REASON_MODEL_API_URL",
  ];

  const missingEnvVars = requiredEnvVars.filter(key => !process.env[key]);
  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
  }

  return {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
    NODE_ENV: process.env.NODE_ENV || "development",
    REASON_MODEL_API_KEY: process.env.REASON_MODEL_API_KEY,
    REASON_MODEL_API_URL: process.env.REASON_MODEL_API_URL,
    REASON_MODEL: process.env.REASON_MODEL,
  };
}
