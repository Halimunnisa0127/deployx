const ApiError = require('./ApiError');
const { StatusCodes } = require('http-status-codes');

class BadRequestError extends ApiError {
  constructor(message = 'Bad Request') {
    super(message, StatusCodes.BAD_REQUEST);
  }
}
module.exports = BadRequestError;
