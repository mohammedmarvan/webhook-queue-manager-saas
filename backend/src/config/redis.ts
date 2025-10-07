import { createClient, RedisClientType } from 'redis';
import logger from './logger';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
let redisClient: RedisClientType;
let connected = false;

export async function connectRedis() {
  if (connected && redisClient?.isOpen) return redisClient;

  redisClient = createClient({ url: redisUrl });

  redisClient.on('connect', () => {
    connected = true;
    logger.info('✅ Redis connected successfully');
  });

  redisClient.on('error', (err) => {
    connected = false;
    logger.error('❌ Redis connection error:', err);
  });

  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  return redisClient;
}

export function isRedisConnected() {
  return connected && redisClient?.isOpen;
}

export function getRedisClient() {
  if (!redisClient || !redisClient.isOpen) {
    logger.warn('⚠️ Redis client not connected yet.');
    return null;
  }
  return redisClient;
}
