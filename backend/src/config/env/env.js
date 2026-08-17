require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

const config = {
  env,
  isDevelopment: env === 'development',
  isProduction: env === 'production',

  port: Number(process.env.PORT) || 5000,

  clientUrl: process.env.CLIENT_URL,

  mongoUri:
    process.env.MONGODB_URI,

  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD || '',
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
  },

  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    redirectUri: process.env.GITHUB_REDIRECT_URI,
    encryptionKey: process.env.GITHUB_TOKEN_ENCRYPTION_KEY,
    webhookSecret: process.env.GITHUB_WEBHOOK_SECRET,
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },

  secrets: {
    encryptionKey: process.env.PROJECT_SECRET_ENCRYPTION_KEY,
  },

  retention: {
    diskCriticalPercent: 90,
    diskWarningPercent: 80,
    artifactRetentionDays: 30,
    artifactCleanupIntervalMs: 24 * 60 * 60 * 1000,
  },

  timeouts: {
    deploymentQueueTimeoutMs: 300000,
    deploymentBuildTimeoutMs: 600000,
  },
};

module.exports = config;