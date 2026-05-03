import Redis from 'ioredis';

class RedisClient {
  private static instance: Redis;

  public static getInstance(url: string = process.env.REDIS_URL || 'redis://localhost:6379'): Redis {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis(url);
    }
    return RedisClient.instance;
  }

  public static async cacheAside<T>(key: string, ttl: number, fetcher: () => Promise<T>): Promise<T> {
    const redis = this.getInstance();
    const cached = await redis.get(key);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const data = await fetcher();
    await redis.set(key, JSON.stringify(data), 'EX', ttl);
    return data;
  }

  public static async publish(channel: string, message: any) {
    const redis = this.getInstance();
    return redis.publish(channel, JSON.stringify(message));
  }

  public static subscribe(channel: string, callback: (message: any) => void) {
    const sub = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    sub.subscribe(channel);
    sub.on('message', (chan, msg) => {
      if (chan === channel) {
        callback(JSON.parse(msg));
      }
    });
    return sub;
  }
}

export default RedisClient;
