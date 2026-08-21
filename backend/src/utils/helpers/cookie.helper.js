const config = require('../../config/env/env');
const { COOKIE_NAMES } = require('../../shared/constants/constants');

const clearLegacyCookies = (res) => {
  const legacyPaths = [
    '/integrations/github/oauth/callback',
    '/integrations/google/oauth/callback',
    '/auth/refresh-token',
    '/auth/login',
    '/auth/register',
  ];

  legacyPaths.forEach((path) => {
    res.cookie(COOKIE_NAMES.REFRESH_TOKEN, '', {
      httpOnly: true,
      secure: config.isProduction,
      sameSite: config.isProduction ? 'none' : 'strict',
      expires: new Date(0),
      path,
    });
  });
};

const setRefreshTokenCookie = (res, token) => {
  clearLegacyCookies(res);
  res.cookie(COOKIE_NAMES.REFRESH_TOKEN, token, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? 'none' : 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
};

const clearRefreshTokenCookie = (res) => {
  clearLegacyCookies(res);
  res.cookie(COOKIE_NAMES.REFRESH_TOKEN, '', {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? 'none' : 'strict',
    expires: new Date(0),
    path: '/',
  });
};

module.exports = {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
};