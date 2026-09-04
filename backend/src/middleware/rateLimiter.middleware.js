const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const config = require('../config/env/env');

const ApiResponse = require('../shared/responses/ApiResponse');

const rateLimiterMiddleware = rateLimit({
  windowMs: config.rateLimit?.windowMs || 15 * 60 * 1000,

  max: config.rateLimit?.maxRequests || 100,

  skip: (req) => {
    return (
      req.path === '/' ||
      req.path === '/health' ||
      req.path.startsWith('/deployments')
    );
  },

  message: ApiResponse.error(
    'Too many requests, please try again later.',
    {},
    429
  ),
});

const aiRateLimiter = rateLimit({
  windowMs: config.rateLimit?.aiWindowMs || 5 * 60 * 1000, // Configurable window
  max: config.rateLimit?.aiMaxRequests || 5, // Configurable max requests
  keyGenerator: (req) => {
    // If authenticated, limit by user ID, otherwise by IP
    return req.user ? req.user.id : (req.ip ? ipKeyGenerator(req.ip) : 'unknown');
  },
  message: ApiResponse.error(
    'AI rate limit exceeded. Please try again later.',
    {},
    429
  ),
});

module.exports = {
  rateLimiterMiddleware,
  aiRateLimiter
};