require('dotenv').config();

const requiredEnvs = [
  'NODE_ENV',
  'PORT',
  'MONGODB_URI',
  'CLIENT_URL',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET',
  'GITHUB_REDIRECT_URI',
  'GITHUB_TOKEN_ENCRYPTION_KEY',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_REDIRECT_URI',
  'PROJECT_SECRET_ENCRYPTION_KEY'
];

for (const env of requiredEnvs) {
  if (!process.env[env]) {
    console.error(`FATAL ERROR: Missing required environment variable: ${env}`);
    process.exit(1);
  }
}

// Strictly validate PROJECT_SECRET_ENCRYPTION_KEY format at startup
const projectKey = process.env.PROJECT_SECRET_ENCRYPTION_KEY;
if (!/^[0-9a-fA-F]{64}$/.test(projectKey)) {
  console.error('FATAL ERROR: PROJECT_SECRET_ENCRYPTION_KEY must be exactly 64 hexadecimal characters.');
  process.exit(1);
}

const nodeEnv = process.env.NODE_ENV || 'development';

const config = {
  env: nodeEnv,
  isDevelopment: nodeEnv === 'development',
  isProduction: nodeEnv === 'production',
  isTest: nodeEnv === 'test',
  port: parseInt(process.env.PORT, 10),
  mongoUri: process.env.MONGODB_URI,
  clientUrl: process.env.CLIENT_URL,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    redirectUri: process.env.GITHUB_REDIRECT_URI,
    encryptionKey: process.env.GITHUB_TOKEN_ENCRYPTION_KEY,
    webhookSecret: process.env.GITHUB_WEBHOOK_SECRET,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || null,
  },
  secrets: {
    encryptionKey: process.env.PROJECT_SECRET_ENCRYPTION_KEY,
  },
  artifacts: {
    maxSizeBytes: parseInt(process.env.ARTIFACT_MAX_SIZE_BYTES, 10) || 50 * 1024 * 1024, // 50MB
    maxFileCount: parseInt(process.env.ARTIFACT_MAX_FILE_COUNT, 10) || 10000,
  },
  timeouts: {
    deploymentQueueTimeoutMs: parseInt(process.env.DEPLOYMENT_QUEUE_TIMEOUT_MS, 10) || 10 * 60 * 1000, // 10 minutes
    deploymentBuildTimeoutMs: parseInt(process.env.DEPLOYMENT_BUILD_TIMEOUT_MS, 10) || 15 * 60 * 1000, // 15 minutes
  },
  retention: {
    artifactRetentionDays: parseInt(process.env.ARTIFACT_RETENTION_DAYS, 10) || 30,
    artifactCleanupIntervalMs: parseInt(process.env.ARTIFACT_CLEANUP_INTERVAL_MS, 10) || 86400000,
    diskWarningPercent: parseInt(process.env.DOCKER_DISK_WARNING_PERCENT, 10) || 75,
    diskCriticalPercent: parseInt(process.env.DOCKER_DISK_CRITICAL_PERCENT, 10) || 90,
  }
};

module.exports = config;