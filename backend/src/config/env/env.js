require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

const config = {
  env,
  isDevelopment: env === 'development',
  isProduction: env === 'production',

  port: Number(process.env.PORT) || 5000,

  clientUrl: process.env.CLIENT_URL,

  appBaseDomain: process.env.APP_BASE_DOMAIN || 'deployx.app',

  allowedOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
    : ['http://localhost:5173'],

  ai: {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
  },

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
    previewSecret: process.env.PREVIEW_JWT_SECRET,
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

  artifacts: {
    maxSizeBytes: Number(process.env.ARTIFACT_MAX_SIZE_BYTES) || 52428800, // 50MB
    maxFileCount: Number(process.env.ARTIFACT_MAX_FILE_COUNT) || 10000,
  },

  timeouts: {
    deploymentQueueTimeoutMs: Number(process.env.DEPLOYMENT_QUEUE_TIMEOUT_MS) || 300000,
    deploymentBuildTimeoutMs: Number(process.env.DEPLOYMENT_BUILD_TIMEOUT_MS) || 600000,
  },

  docker: {
    nodeImage: process.env.DOCKER_NODE_IMAGE || 'node:20-alpine',
    runtimeImage: process.env.DOCKER_RUNTIME_IMAGE || 'nginx:alpine',
    utilityImage: process.env.DOCKER_UTILITY_IMAGE || 'alpine:latest',
    buildMemoryBytes: (Number(process.env.DOCKER_BUILD_MEMORY_MB) || 2048) * 1024 * 1024,
    runtimeMemoryBytes: (Number(process.env.DOCKER_RUNTIME_MEMORY_MB) || 128) * 1024 * 1024,
    buildCpuQuota: (Number(process.env.DOCKER_BUILD_CPU || process.env.DOCKER_BUILD_CPU_QUOTA) || 2) * 1e9,
    runtimeCpuQuota: (Number(process.env.DOCKER_RUNTIME_CPU || process.env.DOCKER_RUNTIME_CPU_QUOTA) || 0.5) * 1e9,
    buildTimeoutMs: Number(process.env.BUILD_TIMEOUT_MS) || Number(process.env.DEPLOYMENT_BUILD_TIMEOUT_MS) || 600000,
    npmCacheVolume: process.env.DOCKER_NPM_CACHE_VOLUME || 'deployx-npm-cache',
  },

  worker: {
    concurrency: Number(process.env.WORKER_CONCURRENCY) || 1,
    heartbeatIntervalMs: Number(process.env.WORKER_HEARTBEAT_INTERVAL_MS) || 15000,
    heartbeatTtlSeconds: Number(process.env.WORKER_HEARTBEAT_TTL_SECONDS) || 30,
    reconciliationIntervalMs: Number(process.env.RECONCILIATION_INTERVAL_MS) || 60000,
  },

  queue: {
    maxAttempts: Number(process.env.QUEUE_MAX_ATTEMPTS) || 3,
    backoffDelayMs: Number(process.env.QUEUE_BACKOFF_DELAY_MS) || 2000,
  },

  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    maxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    aiWindowMs: Number(process.env.AI_RATE_LIMIT_WINDOW_MS) || 5 * 60 * 1000,
    aiMaxRequests: Number(process.env.AI_RATE_LIMIT_MAX_REQUESTS) || 5,
  },

  logs: {
    maxLength: Number(process.env.MAX_LOG_LENGTH) || 5000,
    maxPerDeployment: Number(process.env.MAX_LOGS_PER_DEPLOYMENT) || 10000,
  },

  domains: {
    routerIp: process.env.DOMAIN_ROUTER_IP || '76.76.21.21',
    cnameTarget: process.env.DOMAIN_CNAME_TARGET || `cname.${process.env.APP_BASE_DOMAIN || 'deployx.app'}`,
  },

  email: {
    smtpHost: process.env.SMTP_HOST || '',
    smtpPort: Number(process.env.SMTP_PORT) || 587,
    smtpSecure: process.env.SMTP_SECURE === 'true',
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    smtpFrom: process.env.SMTP_FROM || 'support@deployx.app',
    isConfigured: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
  },
};

module.exports = config;