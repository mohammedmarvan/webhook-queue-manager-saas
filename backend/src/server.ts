// Load environment variables first
import './config/env';
import './utils/bigint-json';

import app from './app';
import logger from './config/logger';
import { connectRedis } from './config/redis';

async function start() {
  try {
    // Starting application
    logger.info(`Starting the application`);

    // Check the redis connection
    logger.info(`Conneting to Redis`);
    await connectRedis();

    app.listen(Number(process.env.API_PORT), '0.0.0.0', () => {
      logger.info(`Server listening on http://localhost:${process.env.API_PORT}`);
    });
  } catch (err: any) {
    logger.error(`Startup failed: ${err.message}`);
    process.exit(1);
  }
}

start();
