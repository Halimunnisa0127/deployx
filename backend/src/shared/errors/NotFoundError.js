const ApiError = require('./ApiError');
const { StatusCodes } = require('http-status-codes');

class NotFoundError extends ApiError {
  constructor(message = 'Not Found') {
    super(message, StatusCodes.NOT_FOUND);
  }
}
module.exports = NotFoundError;
