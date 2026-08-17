const pinoHttp = require('pino-http');

const logger = require('../config/logger/logger');

const requestLoggerMiddleware = pinoHttp({
  logger,
});

module.exports = requestLoggerMiddleware;