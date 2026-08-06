const { StatusCodes } = require('http-status-codes');
const ApiResponse = require('../shared/responses/ApiResponse');
const config = require('../config/env/env');
const logger = require('../config/logger/logger');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  logger.error(err);

  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal Server Error';
  
  // Hide details in production
  const errorDetails = config.env === 'development' ? { stack: err.stack } : {};

  res.status(statusCode).json(
    ApiResponse.error(message, errorDetails, statusCode)
  );
};

module.exports = errorHandler;
