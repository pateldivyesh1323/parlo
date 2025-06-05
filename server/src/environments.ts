import dotenv from "dotenv";
import path from "path";

dotenv.config();

// Need to combine this with the firebase service account key. Later.
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(
  __dirname,
  "./keys/service-account.json",
);

export default {
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  PROJECT_ID: process.env.GOOGLE_CLOUD_PROJECT_ID,
  LOCATION: process.env.GOOGLE_CLOUD_LOCATION,
  PORT: process.env.PORT || 8000,
  ORIGIN: process.env.ORIGIN || "http://localhost:5173",
  MONGO_URI: process.env.MONGO_URI,
};
