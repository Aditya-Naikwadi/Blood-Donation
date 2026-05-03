import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { AppError, ValidationError } from '../../../packages/shared-errors';
import logger from '../../../packages/shared-logger';

const errorHandler: FastifyPluginCallback = (fastify, options, done) => {
  fastify.setErrorHandler((error, request, reply) => {
    // Log error
    logger.error({
      err: error,
      requestId: request.headers['x-correlation-id'],
      url: request.url,
      method: request.method
    });

    // Handle AppError
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        success: false,
        code: error.code,
        message: error.message,
        details: error.details
      });
    }

    // Handle Zod Validation Errors
    if ((error as any).name === 'ZodError') {
      const details = (error as any).issues.map((issue: any) => ({
        field: issue.path.join('.'),
        message: issue.message
      }));
      return reply.status(400).send({
        success: false,
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details
      });
    }

    // Handle Prisma Errors
    if ((error as any).code?.startsWith('P')) {
      if ((error as any).code === 'P2002') {
        return reply.status(409).send({
          success: false,
          code: 'CONFLICT',
          message: 'Resource already exists'
        });
      }
    }

    // Generic 500 for unhandled errors
    return reply.status(500).send({
      success: false,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred'
    });
  });

  done();
};

export default fp(errorHandler);
