const ApiError = require('./ApiError');
const { StatusCodes } = require('http-status-codes');

class NotFoundError extends ApiError {
  constructor(message = 'Not Found') {
    super(message, StatusCodes.NOT_FOUND);
  }
}

NotFoundError.NotFoundError = NotFoundError;
module.exports = NotFoundError;

