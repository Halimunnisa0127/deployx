const crypto = require('crypto');
const config = require('../../../../config/env/env');
const OAuthState = require('../../shared/models/OAuthState');
const GoogleAccount = require('../models/GoogleAccount');
const User = require('../../../users/models/User');
const googleClient = require('../../../../infrastructure/google/google.client');
const { GOOGLE_OAUTH_URL, PROVIDERS } = require('../constants/google.constants');
const ApiError = require('../../../../shared/errors/ApiError');
const { jwtHelper } = require('../../../../utils');

class GoogleAuthService {
  async getConnectUrl(userId = null) {
    const state = crypto.randomBytes(32).toString('hex');
    
    await OAuthState.create({
      userId, // Will be null if anonymous login/register
      provider: PROVIDERS.GOOGLE,
      state,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    const params = new URLSearchParams({
      client_id: config.google.clientId,
      redirect_uri: config.google.redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      state,
      access_type: 'offline', // Request refresh token
      prompt: 'select_account',
    });

    return `${GOOGLE_OAUTH_URL}?${params.toString()}`;
  }

  async handleCallback(code, state, currentUserId = null) {
    // 1. Validate State
    const query = { provider: PROVIDERS.GOOGLE, state };
    if (currentUserId) query.userId = currentUserId;

    const oauthState = await OAuthState.findOneAndDelete(query);

    if (!oauthState) {
      throw new ApiError('Invalid or expired OAuth state', 400);
    }

    // 2. Exchange Code for Token
    const tokenData = await googleClient.exchangeCodeForToken(code);
    const { access_token, refresh_token, expires_in } = tokenData;

    // 3. Fetch Google Profile
    const profile = await googleClient.getUserProfile(access_token);
    
    // We need email from profile
    if (!profile.email) {
      throw new ApiError('Google account does not have an email address', 400);
    }

    // 4. Find GoogleAccount
    let googleAccount = await GoogleAccount.findOne({ googleId: profile.id });
    let user;

    if (googleAccount) {
      // Scenario 1: GoogleAccount exists -> Log the user in
      user = await User.findById(googleAccount.userId);
      if (!user) {
        // Edge case: User deleted but GoogleAccount exists. Recreate or throw error.
        throw new ApiError('Linked User account not found', 500);
      }
      
      // Update GoogleAccount tokens and metadata
      if (refresh_token) {
        googleAccount.refreshToken = refresh_token;
      }
      if (expires_in) {
        googleAccount.tokenExpiresAt = new Date(Date.now() + expires_in * 1000);
      }
      googleAccount.fullName = profile.name;
      googleAccount.avatar = profile.picture;
      await googleAccount.save();

    } else {
      // GoogleAccount does NOT exist
      // Check if DeployX User with this email already exists
      user = await User.findOne({ email: profile.email });

      if (user) {
        // Scenario 2: User exists -> Link GoogleAccount
        // Ensure authProvider includes 'google'
        if (!user.authProvider.includes('google')) {
          user.authProvider.push('google');
          await user.save();
        }
      } else {
        // Scenario 3: Neither exists -> Create User automatically
        user = await User.create({
          fullName: profile.name || 'Unknown',
          email: profile.email,
          avatar: profile.picture || '',
          authProvider: ['google'],
        });
      }

      // Create the associated GoogleAccount
      googleAccount = await GoogleAccount.create({
        userId: user._id,
        googleId: profile.id,
        email: profile.email,
        fullName: profile.name,
        avatar: profile.picture,
        refreshToken: refresh_token || undefined,
        tokenExpiresAt: expires_in ? new Date(Date.now() + expires_in * 1000) : undefined,
      });
    }

    // Check if user is active
    if (!user.isActive) {
      throw new ApiError('Account is disabled', 403);
    }

    // 5. Update login timestamp
    user.lastLogin = new Date();
    await user.save();

    // 6. Generate JWT and Refresh Token
    const accessToken = jwtHelper.generateAccessToken(user._id, user.role);
    const refreshToken = jwtHelper.generateRefreshToken(user._id, user.refreshTokenVersion);

    // Clean user for response
    const userResponse = user.toObject();
    delete userResponse.password;

    return { user: userResponse, accessToken, refreshToken };
  }

  async disconnect(userId) {
    const user = await User.findById(userId);
    if (!user) throw new ApiError('User not found', 404);

    if (user.authProvider.length === 1 && user.authProvider.includes('google')) {
      throw new ApiError('Cannot disconnect Google because it is your only authentication method', 400);
    }

    const deletedAccount = await GoogleAccount.findOneAndDelete({
      userId,
      provider: PROVIDERS.GOOGLE,
    });

    if (!deletedAccount) {
      throw new ApiError('No Google account connected', 404);
    }

    // Remove 'google' from authProvider array
    user.authProvider = user.authProvider.filter(provider => provider !== 'google');
    await user.save();

    return true;
  }
}

module.exports = new GoogleAuthService();
