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
  'GOOGLE_REDIRECT_URI'
];

for (const env of requiredEnvs) {
  if (!process.env[env]) {
    console.error(`FATAL ERROR: Missing required environment variable: ${env}`);
    process.exit(1);
  }
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
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
  },
};

module.exports = config;