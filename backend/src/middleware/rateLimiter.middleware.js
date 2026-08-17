const rateLimit = require('express-rate-limit');

const ApiResponse = require('../shared/responses/ApiResponse');

const rateLimiterMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 100,

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

module.exports = rateLimiterMiddleware;