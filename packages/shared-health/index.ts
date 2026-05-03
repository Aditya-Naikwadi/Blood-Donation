import { FastifyInstance } from 'fastify';

export const healthHandler = (fastify: FastifyInstance) => {
  fastify.get('/health', async (request, reply) => {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.BUILD_VERSION || 'dev',
      uptime: process.uptime(),
      dependencies: {
        database: 'ok', // Implement actual check
        redis: 'ok',    // Implement actual check
        kafka: 'ok'     // Implement actual check
      }
    };

    // If any dependency is down, set status to 'degraded' or 'down'
    // return reply.status(503).send(health); if status is 'down'

    return health;
  });
};
