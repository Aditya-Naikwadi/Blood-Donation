import client from 'prom-client';
import { FastifyInstance } from 'fastify';

export const initMetrics = (fastify: FastifyInstance) => {
  const collectDefaultMetrics = client.collectDefaultMetrics;
  collectDefaultMetrics({ prefix: 'blood_donation_' });

  const httpRequestDurationMicroseconds = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
  });

  fastify.addHook('onResponse', (request, reply, done) => {
    httpRequestDurationMicroseconds
      .labels(request.method, request.routeOptions.url || 'unknown', reply.statusCode.toString())
      .observe(reply.getResponseTime() / 1000);
    done();
  });

  fastify.get('/metrics', async (request, reply) => {
    reply.header('Content-Type', client.register.contentType);
    return await client.register.metrics();
  });
};
