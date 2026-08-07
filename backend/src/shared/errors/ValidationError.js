const ApiError = require('./ApiError');
const { StatusCodes } = require('http-status-codes');

class ValidationError extends ApiError {
  constructor(message = 'Validation Error', errors = []) {
    super(message, StatusCodes.BAD_REQUEST);
    this.errors = errors;
  }
}
module.exports = ValidationError;
