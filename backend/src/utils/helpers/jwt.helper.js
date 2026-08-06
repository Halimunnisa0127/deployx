const jwt = require('jsonwebtoken');
const config = require('../../config/env/env');

const generateAccessToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiration,
  });
};

const generateRefreshToken = (userId, tokenVersion) => {
  return jwt.sign(
    { id: userId, version: tokenVersion },
    config.jwt.refreshSecret,
    {
      expiresIn: config.jwt.refreshExpiration,
    }
  );
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, config.jwt.accessSecret);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.jwt.refreshSecret);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
