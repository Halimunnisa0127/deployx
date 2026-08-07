const { StatusCodes } = require('http-status-codes');
const authService = require('../services/auth.service');
const ApiResponse = require('../../../shared/responses/ApiResponse');
const { setRefreshTokenCookie, clearRefreshTokenCookie } = require('../../../utils/helpers/cookie.helper');
const { COOKIE_NAMES } = require('../../../shared/constants/constants');

class AuthController {
  async register(req, res) {
    const { user, accessToken, refreshToken } = await authService.register(req.body);
    setRefreshTokenCookie(res, refreshToken);
    res.status(StatusCodes.CREATED).json(ApiResponse.created('Registration successful', { user, accessToken }));
  }

  async login(req, res) {
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    setRefreshTokenCookie(res, refreshToken);
    res.status(StatusCodes.OK).json(ApiResponse.success('Login successful', { user, accessToken }));
  }

  async refreshToken(req, res) {
    const incomingToken = req.cookies[COOKIE_NAMES.REFRESH_TOKEN];
    if (!incomingToken) {
      return res.status(StatusCodes.UNAUTHORIZED).json(ApiResponse.error('No refresh token provided', {}, StatusCodes.UNAUTHORIZED));
    }

    const { accessToken, refreshToken } = await authService.refreshTokens(incomingToken);
    setRefreshTokenCookie(res, refreshToken);
    res.status(StatusCodes.OK).json(ApiResponse.success('Token refreshed successfully', { accessToken }));
  }

  async logout(req, res) {
    if (req.user) {
      await authService.logout(req.user.id);
    }
    clearRefreshTokenCookie(res);
    res.status(StatusCodes.OK).json(ApiResponse.success('Logout successful'));
  }

  async getMe(req, res) {
    const user = await authService.getCurrentUser(req.user.id);
    res.status(StatusCodes.OK).json(ApiResponse.success('User retrieved successfully', { user }));
  }
}

module.exports = new AuthController();
