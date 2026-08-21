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
    const rawCookies = req.headers.cookie;
    const tokens = [];

    if (rawCookies) {
      const pairs = rawCookies.split(';');
      for (const pair of pairs) {
        const index = pair.indexOf('=');
        if (index !== -1) {
          const key = pair.substring(0, index).trim();
          const val = pair.substring(index + 1).trim();
          if (key === COOKIE_NAMES.REFRESH_TOKEN && val) {
            tokens.push(val);
          }
        }
      }
    }

    if (tokens.length === 0) {
      return res.status(StatusCodes.UNAUTHORIZED).json(ApiResponse.error('No refresh token provided', {}, StatusCodes.UNAUTHORIZED));
    }

    const { accessToken, refreshToken } = await authService.refreshTokens(tokens);
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

  async forgotPassword(req, res) {
    await authService.forgotPassword(req.body.email);
    res.status(StatusCodes.OK).json(ApiResponse.success('If an account with that email exists, an OTP has been sent.'));
  }

  async resetPassword(req, res) {
    const { email, otp, newPassword } = req.body;
    await authService.resetPassword(email, otp, newPassword);
    res.status(StatusCodes.OK).json(ApiResponse.success('Password has been reset successfully.'));
  }
}

module.exports = new AuthController();
