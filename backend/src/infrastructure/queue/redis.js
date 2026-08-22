const Redis = require('ioredis');
const config = require('../../config/env/env');

const isProduction = process.env.NODE_ENV === 'production';

const redisConfig = {
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,

  // Required by BullMQ
  maxRetriesPerRequest: null,

  retryStrategy(times) {
    return Math.min(times * 50, 2000);
  },
};

// Production Redis providers such as Upstash use TLS.
// Local Redis normally does not.
if (isProduction || (config.redis.host && config.redis.host.includes('upstash.io'))) {
  redisConfig.tls = {};
}

const redisConnection = new Redis(redisConfig);

let lastLoggedErrorTime = 0;
const ERROR_LOG_THROTTLE_MS = 10_000;

redisConnection.on('error', (err) => {
  const now = Date.now();

  if (now - lastLoggedErrorTime > ERROR_LOG_THROTTLE_MS) {
    console.error(
      '[Redis] Connection Error:',
      err?.message || 'Connection refused'
    );

    lastLoggedErrorTime = now;
  }
});

redisConnection.on('ready', () => {
  console.log(
    `[Redis] Connected successfully (${isProduction ? 'production TLS' : 'local'})`
  );

  lastLoggedErrorTime = 0;
});

module.exports = redisConnection;