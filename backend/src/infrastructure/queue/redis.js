const Redis = require('ioredis');
const config = require('../../config/env/env');

const redisConfig = {
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  maxRetriesPerRequest: null, // Required by BullMQ
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
};

// Enable TLS for production Redis (Upstash)
if (process.env.NODE_ENV === 'production') {
  redisConfig.tls = {};
}

const redisConnection = new Redis(redisConfig);

let lastLoggedErrorTime = 0;
const ERROR_LOG_THROTTLE_MS = 10000;

redisConnection.on('error', (err) => {
  const now = Date.now();

  if (now - lastLoggedErrorTime > ERROR_LOG_THROTTLE_MS) {
    console.error(
      '[Redis] Connection Error:',
      err.message || 'Connection refused'
    );
    lastLoggedErrorTime = now;
  }
});

redisConnection.on('ready', () => {
  console.log('[Redis] Connected successfully.');
  lastLoggedErrorTime = 0;
});

module.exports = redisConnection;