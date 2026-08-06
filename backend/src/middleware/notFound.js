const { StatusCodes } = require('http-status-codes');
const ApiResponse = require('../shared/responses/ApiResponse');

const notFound = (req, res, next) => {
  res.status(StatusCodes.NOT_FOUND).json(
    ApiResponse.error(
      `Resource not found: ${req.originalUrl}`,
      {},
      StatusCodes.NOT_FOUND
    )
  );
};

module.exports = notFound;
