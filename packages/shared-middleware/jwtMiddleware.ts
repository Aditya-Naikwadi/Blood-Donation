import { FastifyPluginCallback, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import jwt from 'jsonwebtoken';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      userId: string;
      role: string;
    };
  }
}

const jwtMiddleware: FastifyPluginCallback<{ secret: string }> = (fastify, options, done) => {
  fastify.decorateRequest('user', null);

  fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    // Skip auth for login/register
    if (request.url.includes('/auth/login') || request.url.includes('/auth/register')) {
      return;
    }

    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, options.secret) as any;
      request.user = {
        userId: decoded.userId,
        role: decoded.role
      };
    } catch (err) {
      return reply.status(401).send({ error: 'Unauthorized: Invalid token' });
    }
  });

  done();
};

export default fp(jwtMiddleware);
