import Redis from "ioredis";
import "dotenv/config.js";

export const redis = new Redis(process.env.UPSTASH_REDIS_URL);
