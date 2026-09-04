const { rateLimit, ipKeyGenerator } = require('express-rate-limit');

const ApiResponse = require('../shared/responses/ApiResponse');

const rateLimiterMiddleware = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute

  max: 1000,

  skip: (req) => {
    return (
      req.path === '/' ||
      req.path === '/health' ||
      req.path.startsWith('/deployments') ||
      process.env.NODE_ENV === 'development'
    );
  },

  message: ApiResponse.error(
    'Too many requests, please try again later.',
    {},
    429
  ),
});

const aiRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // 5 requests per 5 minutes per IP
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