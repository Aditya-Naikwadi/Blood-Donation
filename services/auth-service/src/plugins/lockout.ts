import { FastifyPluginCallback } from 'fastify';
import RedisClient from '../../../packages/shared-redis';

const LOCKOUT_LIMIT = 5;
const LOCKOUT_DURATION = 15 * 60; // 15 minutes

export const lockoutMiddleware: FastifyPluginCallback = (fastify, options, done) => {
  fastify.addHook('preHandler', async (request, reply) => {
    if (request.url !== '/auth/login') return;

    const { email } = request.body as any;
    const redis = RedisClient.getInstance();
    const attempts = await redis.get(`login_attempts:${email}`);

    if (attempts && parseInt(attempts) >= LOCKOUT_LIMIT) {
      return reply.status(429).send({
        error: 'Too many failed login attempts. Please try again in 15 minutes.'
      });
    }
  });

  done();
};

export const recordFailedAttempt = async (email: string) => {
  const redis = RedisClient.getInstance();
  const key = `login_attempts:${email}`;
  const attempts = await redis.incr(key);
  
  if (attempts === 1) {
    await redis.expire(key, LOCKOUT_DURATION);
  }
};

export const clearAttempts = async (email: string) => {
  const redis = RedisClient.getInstance();
  await redis.del(`login_attempts:${email}`);
};
