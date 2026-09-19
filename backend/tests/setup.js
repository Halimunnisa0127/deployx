const redisConnection = require('../src/infrastructure/queue/redis');
const mongoose = require('mongoose');

afterAll(async () => {
  try {
    if (redisConnection && typeof redisConnection.quit === 'function' && redisConnection.status !== 'end') {
      await redisConnection.quit().catch(() => {
        if (redisConnection && typeof redisConnection.disconnect === 'function') {
          redisConnection.disconnect();
        }
      });
    }
  } catch (err) {
    if (redisConnection && typeof redisConnection.disconnect === 'function') {
      redisConnection.disconnect();
    }
  }

  try {
    if (mongoose.connection && mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  } catch (err) {
    // Ignore teardown disconnect errors
  }
});
