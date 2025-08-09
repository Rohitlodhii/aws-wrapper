import { createClient } from 'redis';
import { configDotenv } from "dotenv";
configDotenv()


export const redisClient = createClient({
    username: process.env.REDIS_DB_USER!,
    password: process.env.REDIS_DB_KEY!,
    socket: {
        host: process.env.REDIS_DB_ENDPOINT!,
        port: Number(process.env.REDIS_PORT),
    }
});