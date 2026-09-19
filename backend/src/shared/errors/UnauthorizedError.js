const ApiError = require('./ApiError');
const { StatusCodes } = require('http-status-codes');

class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

UnauthorizedError.UnauthorizedError = UnauthorizedError;
module.exports = UnauthorizedError;

