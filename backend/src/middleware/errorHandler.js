const { StatusCodes } = require('http-status-codes');
const ApiResponse = require('../shared/responses/ApiResponse');
const config = require('../config/env/env');
const logger = require('../config/logger/logger');
const ApiError = require('../shared/errors/ApiError');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  logger.error(err);

  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Internal Server Error';
  let errorDetails = {};

  if (err.errors) {
    errorDetails.errors = err.errors;
  }

  if (config.isDevelopment) {
    errorDetails.stack = err.stack;
  }

  res.status(statusCode).json(
    ApiResponse.error(message, errorDetails, statusCode)
  );
};

module.exports = errorHandler;
