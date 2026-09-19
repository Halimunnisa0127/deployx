class ApiError extends Error {
  constructor(message, statusCode, isOperational = true, stack = '') {
    let finalMessage = message;
    let finalStatusCode = statusCode;

    if (typeof message === 'number') {
      finalStatusCode = message;
      finalMessage = statusCode || 'API Error';
    }

    super(finalMessage);
    this.statusCode = finalStatusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}


ApiError.ApiError = ApiError;
module.exports = ApiError;

