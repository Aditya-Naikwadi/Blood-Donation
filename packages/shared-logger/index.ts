import pino from 'pino';

const maskPII = (str: string) => {
  if (str.includes('@')) {
    const [user, domain] = str.split('@');
    return `${user[0]}***@${domain}`;
  }
  if (str.startsWith('+')) {
    return str.slice(0, 3) + 'XXXXX' + str.slice(-4);
  }
  return '***';
};

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  serializers: {
    email: (val) => maskPII(val),
    phone: (val) => maskPII(val),
    password: () => '***',
    token: () => '***',
  },
  transport: process.env.NODE_ENV !== 'production' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname',
    }
  } : undefined,
});

export default logger;
