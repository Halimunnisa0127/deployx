const { Queue } = require('bullmq');
const redisConnection = require('./redis');

const deploymentQueue = new Queue('deployments', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

module.exports = deploymentQueue;
