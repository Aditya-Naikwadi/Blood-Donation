import CircuitBreaker from 'opossum';
import logger from '../../../packages/shared-logger';

const options = {
  timeout: 3000, // 3 seconds
  errorThresholdPercentage: 50,
  resetTimeout: 30000 // 30 seconds
};

export const createCircuitBreaker = (fn: (...args: any[]) => Promise<any>, serviceName: string) => {
  const breaker = new CircuitBreaker(fn, options);

  breaker.on('open', () => logger.warn(`Circuit breaker OPEN for ${serviceName}`));
  breaker.on('halfOpen', () => logger.info(`Circuit breaker HALF-OPEN for ${serviceName}`));
  breaker.on('close', () => logger.info(`Circuit breaker CLOSED for ${serviceName}`));
  
  breaker.fallback(() => {
    logger.error(`Fallback triggered for ${serviceName}`);
    return { error: 'Service temporarily unavailable', fallback: true };
  });

  return breaker;
};
