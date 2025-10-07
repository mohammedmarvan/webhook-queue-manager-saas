import Queue from 'bull';
import { connectRedis, isRedisConnected } from './redis';
import logger from './logger';

interface bullQOption {
  delay?: number;
}

export class BullQueue<T> {
  public queue: Queue.Queue<T>;

  constructor(queueName: string) {
    // Ensure Redis is connected first
    if (!isRedisConnected()) {
      connectRedis().catch((err) => {
        logger.error(`❌ Redis not connected. Queue [${queueName}] may fail:`, err);
      });
    }

    const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

    // Bull uses ioredis internally, so just pass the URL
    this.queue = new Queue<T>(queueName, redisUrl);

    this.queue.on('ready', () => {
      logger.info(`✅ Bull queue [${queueName}] is ready`);
    });

    this.queue.on('error', (err) => {
      logger.error(`❌ Error in Bull queue [${queueName}]:`, err);
    });
  }

  async addJob(data: T, options?: bullQOption) {
    return this.queue.add(data, options);
  }
}
