const ApiError = require('./ApiError');
const { StatusCodes } = require('http-status-codes');

class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden') {
    super(message, StatusCodes.FORBIDDEN);
  }
}
module.exports = ForbiddenError;
