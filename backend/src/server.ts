import app from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/prisma';
import { logger } from './utils/logger';

let server: ReturnType<typeof app.listen>;

async function startServer(): Promise<void> {
  try {
    await connectDatabase();
    logger.info('Connected to PostgreSQL via Prisma');

    server = app.listen(env.port, () => {
      logger.info(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

async function shutdown(signal: string): Promise<void> {
  logger.info(`${signal} received. Shutting down gracefully...`);
  server?.close(async () => {
    await disconnectDatabase();
    logger.info('Server and database connections closed.');
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer();
