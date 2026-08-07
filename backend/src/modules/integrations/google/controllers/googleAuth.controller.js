const { StatusCodes } = require('http-status-codes');
const googleAuthService = require('../services/googleAuth.service');
const ApiResponse = require('../../../../shared/responses/ApiResponse');
const { setRefreshTokenCookie } = require('../../../../utils/helpers/cookie.helper');
const config = require('../../../../config/env/env');

class GoogleAuthController {
  async connect(req, res) {
    // If user is authenticated, we can pass their ID for account linking
    const userId = req.user?.id || null;
    const url = await googleAuthService.getConnectUrl(userId);
    res.redirect(url);
  }

  async callback(req, res) {
    const { code, state } = req.query;
    // Current user if already logged in (account linking)
    const currentUserId = req.user?.id || null;

    try {
      const { user, accessToken, refreshToken } = await googleAuthService.handleCallback(
        code,
        state,
        currentUserId
      );

      // Set the refresh token securely in a cookie
      setRefreshTokenCookie(res, refreshToken);

      // The frontend will dispatch a refresh token action to get the access token
      res.redirect(`${config.clientUrl}/oauth/success`);
    } catch (error) {
      // Redirect to login page with error
      res.redirect(`${config.clientUrl}/login?error=${encodeURIComponent(error.message)}`);
    }
  }

  async disconnect(req, res) {
    // Requires authentication
    const userId = req.user.id;
    await googleAuthService.disconnect(userId);
    res.status(StatusCodes.OK).json(ApiResponse.success('Google account disconnected successfully'));
  }
}

module.exports = new GoogleAuthController();
