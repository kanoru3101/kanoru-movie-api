import Redis from 'ioredis';
import * as dotenv from "dotenv";
dotenv.config()
export default new Redis({
  host: (process.env.REDIS_HOST || 'localhost') as string,
  port: (process.env.REDIS_PORT || 6379) as number,
  maxRetriesPerRequest: null,
  enableReadyCheck: false
});
