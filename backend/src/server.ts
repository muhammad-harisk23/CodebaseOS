import app from './app';
import { env } from './config/env';
import { connectDatabase } from './config/database';
import { logger } from './utils/logger';

async function start() {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Start server
    app.listen(env.port, () => {
      logger.info(`CodebaseOS API server running on port ${env.port}`);
      logger.info(`Environment: ${env.nodeEnv}`);
      logger.info(`Health check: http://localhost:${env.port}/api/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();