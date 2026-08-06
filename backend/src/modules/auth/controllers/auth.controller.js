const { StatusCodes } = require('http-status-codes');
const authService = require('../services/auth.service');
const ApiResponse = require('../../../shared/responses/ApiResponse');
const config = require('../../../config/env/env');

const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

const clearRefreshCookie = (res) => {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'strict',
    expires: new Date(0),
  });
};

class AuthController {
  async register(req, res) {
    const { user, accessToken, refreshToken } = await authService.register(req.body);
    setRefreshCookie(res, refreshToken);
    res.status(StatusCodes.CREATED).json(ApiResponse.success('Registration successful', { user, accessToken }));
  }

  async login(req, res) {
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    setRefreshCookie(res, refreshToken);
    res.status(StatusCodes.OK).json(ApiResponse.success('Login successful', { user, accessToken }));
  }

  async refreshToken(req, res) {
    const incomingToken = req.cookies.refreshToken;
    if (!incomingToken) {
      return res.status(StatusCodes.UNAUTHORIZED).json(ApiResponse.error('No refresh token provided', {}, StatusCodes.UNAUTHORIZED));
    }

    const { accessToken, refreshToken } = await authService.refreshTokens(incomingToken);
    setRefreshCookie(res, refreshToken);
    res.status(StatusCodes.OK).json(ApiResponse.success('Token refreshed successfully', { accessToken }));
  }

  async logout(req, res) {
    if (req.user) {
      await authService.logout(req.user.id);
    }
    clearRefreshCookie(res);
    res.status(StatusCodes.OK).json(ApiResponse.success('Logout successful'));
  }

  async getMe(req, res) {
    const user = await authService.getCurrentUser(req.user.id);
    res.status(StatusCodes.OK).json(ApiResponse.success('User retrieved successfully', { user }));
  }
}

module.exports = new AuthController();
