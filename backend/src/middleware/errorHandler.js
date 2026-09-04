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

  // Handle Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = StatusCodes.BAD_REQUEST;
    message = `Invalid ${err.path || 'identifier'}: ${err.value}`;
  } else if (err.name === 'ValidationError') {
    statusCode = StatusCodes.BAD_REQUEST;
    message = err.message || 'Validation Error';
  }

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
