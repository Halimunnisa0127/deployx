const { StatusCodes } = require('http-status-codes');
const ApiResponse = require('../shared/responses/ApiResponse');
const { verifyAccessToken } = require('../utils/helpers/jwt.helper');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(ApiResponse.error('Authentication required', {}, StatusCodes.UNAUTHORIZED));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded; // { id, role, iat, exp }
    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(ApiResponse.error('Invalid or expired token', {}, StatusCodes.UNAUTHORIZED));
  }
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
    } catch (error) {
      // Ignore token errors for optional auth
    }
  }
  next();
};

module.exports = { authenticate, optionalAuth };
