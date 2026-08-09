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

const redisConnection = new Redis(redisConfig);

redisConnection.on('error', (err) => {
  console.error('[Redis] Connection Error:', err.message);
});

redisConnection.on('ready', () => {
  console.log('[Redis] Connected successfully.');
});

module.exports = redisConnection;
