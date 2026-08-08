const githubAuthService = require('../services/githubAuth.service');
const githubRepositoryService = require('../services/githubRepository.service');
const ApiResponse = require('../../../../shared/responses/ApiResponse');
const { setRefreshTokenCookie } = require('../../../../utils/helpers/cookie.helper');
const config = require('../../../../config/env/env');

const repositorySyncService = require('../services/repositorySync.service');

exports.connect = async (req, res) => {
  const userId = req.user?.id || null;
  const { prompt } = req.query;
  const url = await githubAuthService.getConnectUrl(userId, prompt);
  res.redirect(url);
};

exports.callback = async (req, res) => {
  const userId = req.user?.id || null;
  const { code, state } = req.query;

  try {
    const { user, accessToken, refreshToken } = await githubAuthService.handleCallback(code, state, userId);
    
    // Set the refresh token securely in a cookie
    setRefreshTokenCookie(res, refreshToken);
    
    // The frontend will dispatch a refresh token action to get the access token
    res.redirect(`${config.clientUrl}/oauth/success`);
  } catch (error) {
    // Redirect to login page with error
    res.redirect(`${config.clientUrl}/login?error=${encodeURIComponent(error.message)}`);
  }
};

exports.syncRepositories = async (req, res) => {
  const userId = req.user.id;
  const result = await repositorySyncService.syncRepositories(userId);
  res.json(ApiResponse.success('Repositories synchronized successfully', result));
};

exports.getRepositories = async (req, res) => {
  const userId = req.user.id;
  const result = await repositorySyncService.getRepositories(userId, req.query);
  res.json(ApiResponse.success('Repositories retrieved', result));
};

exports.getBranches = async (req, res) => {
  const userId = req.user.id;
  const { owner, repo } = req.params;
  const branches = await githubRepositoryService.getBranches(userId, owner, repo);
  res.json(ApiResponse.success('Branches retrieved', { branches }));
};

exports.disconnect = async (req, res) => {
  const userId = req.user.id;
  await githubAuthService.disconnect(userId);
  res.json(ApiResponse.success('GitHub account disconnected'));
};

exports.getStatus = async (req, res) => {
  const userId = req.user.id;
  const status = await repositorySyncService.getSyncStatus(userId);
  res.json(ApiResponse.success('Connection status retrieved', status));
};
