import { createClient } from "redis";
import environments from "../environments";

const redisClient = createClient({
  url: environments.REDIS_URI,
});
const subClient = redisClient.duplicate();

redisClient.on("error", (error) => {
  console.error("❌Redis connection error:", error);
});

redisClient.on("connect", () => {
  console.log("✅ Redis connected successfully");
});

subClient.on("error", (error) => {
  console.error("❌Redis sub connection error:", error);
});

subClient.on("connect", () => {
  console.log("✅ Redis sub connected successfully");
});

const connectRedis = async () => {
  await redisClient.connect();
  await subClient.connect();
};

export { connectRedis, redisClient, subClient };
