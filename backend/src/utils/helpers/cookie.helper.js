const config = require('../../config/env/env');
const { COOKIE_NAMES } = require('../../shared/constants/constants');

const setRefreshTokenCookie = (res, token) => {
  res.cookie(COOKIE_NAMES.REFRESH_TOKEN, token, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? 'none' : 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

const clearRefreshTokenCookie = (res) => {
  res.cookie(COOKIE_NAMES.REFRESH_TOKEN, '', {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? 'none' : 'strict',
    expires: new Date(0),
  });
};

module.exports = {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
};
