const crypto = require('crypto');
const config = require('../../../../config/env/env');
const OAuthState = require('../../shared/models/OAuthState');
const GitHubAccount = require('../models/GitHubAccount');
const User = require('../../../users/models/User');
const GitHubClient = require('../../../../infrastructure/github/github.client');
const { encrypt } = require('../../../../utils/helpers/encryption.helper');
const { GITHUB_OAUTH_URL, GITHUB_TOKEN_URL, PROVIDERS, PROVIDER_TYPES } = require('../constants/github.constants');
const ApiError = require('../../../../shared/errors/ApiError');
const { jwtHelper } = require('../../../../utils');

exports.getConnectUrl = async (userId = null, prompt = null) => {
  const state = crypto.randomBytes(32).toString('hex');
  
  // Store state for 10 minutes
  await OAuthState.create({
    userId,
    provider: PROVIDERS.GITHUB,
    state,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  const params = new URLSearchParams({
    client_id: config.github.clientId,
    redirect_uri: config.github.redirectUri,
    state,
    scope: 'repo read:user user:email',
  });
  
  if (prompt === 'consent') {
    params.append('prompt', 'consent');
  }

  return `${GITHUB_OAUTH_URL}?${params.toString()}`;
};

exports.handleCallback = async (code, state, currentUserId = null) => {
  // Validate State
  const query = { provider: PROVIDERS.GITHUB, state };
  if (currentUserId) query.userId = currentUserId;

  const oauthState = await OAuthState.findOneAndDelete(query);

  if (!oauthState) {
    throw new ApiError('Invalid or expired OAuth state', 400);
  }

  // Exchange Code for Access Token
  const tokenParams = new URLSearchParams({
    client_id: config.github.clientId,
    client_secret: config.github.clientSecret,
    code,
    redirect_uri: config.github.redirectUri,
  });

  const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: tokenParams.toString(),
  });

  const tokenData = await tokenResponse.json();

  if (tokenData.error) {
    throw new ApiError(`GitHub OAuth Error: ${tokenData.error_description}`, 400);
  }

  const accessToken = tokenData.access_token;
  if (!accessToken) {
    throw new ApiError('Failed to obtain access token from GitHub', 400);
  }

  // Fetch GitHub User Profile
  const githubClient = new GitHubClient(accessToken);
  const userProfile = await githubClient.get('/user');
  
  // We need email from profile, or fetch from /user/emails
  let primaryEmail = userProfile.email;
  if (!primaryEmail) {
    const emails = await githubClient.get('/user/emails');
    const primary = emails.find(e => e.primary && e.verified);
    if (primary) {
      primaryEmail = primary.email;
    }
  }

  if (!primaryEmail) {
    throw new ApiError('GitHub account does not have a verified primary email', 400);
  }

  // Encrypt Access Token
  const encryptedToken = encrypt(accessToken);

  let githubAccount = await GitHubAccount.findOne({ githubId: String(userProfile.id) });
  let user;

  if (githubAccount) {
    // Scenario 1: GitHubAccount exists -> Log the user in
    user = await User.findById(githubAccount.userId);
    if (!user) {
      throw new ApiError('Linked User account not found', 500);
    }
    
    // Update tokens and metadata
    githubAccount.username = userProfile.login;
    githubAccount.avatarUrl = userProfile.avatar_url;
    githubAccount.encryptedAccessToken = encryptedToken;
    await githubAccount.save();
  } else {
    // Check if DeployX User with this email already exists
    user = await User.findOne({ email: primaryEmail });

    if (user) {
      // Scenario 2: User exists -> Link GitHubAccount
      if (!user.authProvider.includes('github')) {
        user.authProvider.push('github');
        await user.save();
      }
    } else {
      // Scenario 3: Neither exists -> Create User automatically
      user = await User.create({
        fullName: userProfile.name || userProfile.login,
        email: primaryEmail,
        avatar: userProfile.avatar_url || '',
        authProvider: ['github'],
      });
    }

    // Create the associated GitHubAccount
    githubAccount = await GitHubAccount.create({
      userId: user._id,
      provider: PROVIDERS.GITHUB,
      providerType: PROVIDER_TYPES.OAUTH,
      githubId: String(userProfile.id),
      username: userProfile.login,
      avatarUrl: userProfile.avatar_url,
      encryptedAccessToken: encryptedToken,
      connectedAt: new Date(),
    });
  }

  // Check if user is active
  if (!user.isActive) {
    throw new ApiError('Account is disabled', 403);
  }

  // Update login timestamp
  user.lastLogin = new Date();
  await user.save();

  // Generate JWT and Refresh Token
  const jwtToken = jwtHelper.generateAccessToken(user._id, user.role);
  const refreshToken = jwtHelper.generateRefreshToken(user._id, user.refreshTokenVersion);

  const userResponse = user.toObject();
  delete userResponse.password;

  return { user: userResponse, accessToken: jwtToken, refreshToken };
};

exports.disconnect = async (userId) => {
  const deletedAccount = await GitHubAccount.findOneAndDelete({
    userId,
    provider: PROVIDERS.GITHUB,
  });

  if (!deletedAccount) {
    throw new ApiError('No GitHub account connected', 404);
  }

  return true;
};
