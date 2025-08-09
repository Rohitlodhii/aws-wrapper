import { redisClient } from "../lib/redis.js"


export const addToQueue = (id: string) => {
  return redisClient.lPush("build-queue", id);
};
