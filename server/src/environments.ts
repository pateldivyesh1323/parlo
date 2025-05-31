import dotenv from "dotenv";
import path from "path";

dotenv.config();

process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(
  __dirname,
  "./keys/service-account.json",
);

export default {
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  PROJECT_ID: process.env.GOOGLE_CLOUD_PROJECT_ID,
  LOCATION: process.env.GOOGLE_CLOUD_LOCATION,
};
