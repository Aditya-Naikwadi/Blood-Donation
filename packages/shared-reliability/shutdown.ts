// Node.js implementation
import { FastifyInstance } from 'fastify';
import logger from '../shared-logger';

export const setupGracefulShutdown = (fastify: FastifyInstance, dependencies: any[]) => {
  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);
    
    // Stop accepting new requests
    await fastify.close();
    
    // Close dependencies
    for (const dep of dependencies) {
      if (dep.close) await dep.close();
      if (dep.disconnect) await dep.disconnect();
    }
    
    logger.info('Graceful shutdown completed.');
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};
