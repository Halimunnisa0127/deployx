const { Queue } = require('bullmq');
const redisConnection = require('./redis');
const config = require('../../config/env/env');

const deploymentQueue = new Queue('deployments', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: config.queue?.maxAttempts || 3,
    backoff: {
      type: 'exponential',
      delay: config.queue?.backoffDelayMs || 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

module.exports = deploymentQueue;
