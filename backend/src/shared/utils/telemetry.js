const mongoose = require('mongoose');
const redisConnection = require('../../infrastructure/queue/redis');
const deploymentQueue = require('../../infrastructure/queue/deployment.queue');
const logger = require('../../config/logger/logger');

/**
 * Checks if MongoDB is fully connected.
 * @returns {boolean}
 */
function isMongoReady() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

/**
 * Checks if Redis is fully connected and ready.
 * @returns {boolean}
 */
function isRedisReady() {
  return redisConnection && redisConnection.status === 'ready';
}

/**
 * Retrieves the current job statistics for the deployments queue.
 * @returns {Promise<object>}
 */
async function getQueueMetrics() {
  try {
    const counts = await deploymentQueue.getJobCounts();
    return {
      queue: 'deployments',
      waiting: counts.waiting || 0,
      active: counts.active || 0,
      completed: counts.completed || 0,
      failed: counts.failed || 0,
      delayed: counts.delayed || 0,
    };
  } catch (error) {
    logger.error({ err: error.message }, 'Failed to retrieve queue metrics from Redis');
    throw new Error('Queue metrics unavailable.');
  }
}

module.exports = {
  isMongoReady,
  isRedisReady,
  getQueueMetrics,
};
