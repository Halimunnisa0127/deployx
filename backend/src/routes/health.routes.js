const express = require('express');
const fs = require('fs');
const path = require('path');

const config = require('../config/env/env');
const ApiResponse = require('../shared/responses/ApiResponse');
const telemetry = require('../shared/utils/telemetry');

const router = express.Router();

// GET /
router.get('/', (req, res) => {
  res.json(
    ApiResponse.success('DeployX Backend API')
  );
});

// GET /health
router.get('/health', (req, res) => {
  let version = 'unknown';

  try {
    const packagePath = path.join(
      __dirname,
      '../../package.json'
    );

    const pkg = JSON.parse(
      fs.readFileSync(packagePath, 'utf8')
    );

    version = pkg.version;
  } catch (err) {
    // Ignore error.
    // Version remains unknown.
  }

  res.json({
    success: true,
    message: 'DeployX Backend Running',
    environment: config.env,
    version,
    uptime: Number(process.uptime().toFixed(2)),
    timestamp: new Date().toISOString(),
  });
});

// GET /health/ready
router.get('/health/ready', (req, res) => {
  const mongoReady = telemetry.isMongoReady();
  const redisReady = telemetry.isRedisReady();

  const isHealthy = mongoReady && redisReady;

  const responseBody = {
    success: isHealthy,

    status: isHealthy
      ? 'ready'
      : 'unavailable',

    services: {
      mongodb: mongoReady
        ? 'ready'
        : 'unavailable',

      redis: redisReady
        ? 'ready'
        : 'unavailable',
    },

    timestamp: new Date().toISOString(),
  };

  if (!isHealthy) {
    return res
      .status(503)
      .json(responseBody);
  }

  return res.json(responseBody);
});

module.exports = router;