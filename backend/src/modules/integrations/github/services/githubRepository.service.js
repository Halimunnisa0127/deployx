const GitHubAccount = require('../models/GitHubAccount');
const GitHubClient = require('../../../../infrastructure/github/github.client');
const { decrypt } = require('../../../../utils/helpers/encryption.helper');
const ApiError = require('../../../../shared/errors/ApiError');
const { mapRepositories, mapBranches } = require('../mappers/repository.mapper');
const { mapBranches: branchMapper } = require('../mappers/branch.mapper'); // Fixed destructuring properly below

const getGitHubClientForUser = async (userId) => {
  const account = await GitHubAccount.findOne({ userId });
  if (!account) {
    throw new ApiError(404, 'GitHub account not connected');
  }

  const accessToken = decrypt(account.encryptedAccessToken);
  return new GitHubClient(accessToken);
};

exports.getRepositories = async (userId, query) => {
  const client = await getGitHubClientForUser(userId);
  
  const { page = 1, per_page = 30, sort = 'updated', search = '' } = query;
  
  let endpoint = '';
  
  if (search) {
    endpoint = `/search/repositories?q=${encodeURIComponent(search)}+user:${client.username}&page=${page}&per_page=${per_page}&sort=${sort}`;
  } else {
    // We can fetch the authenticated user's repos
    endpoint = `/user/repos?page=${page}&per_page=${per_page}&sort=${sort}`;
  }

  const data = await client.get(endpoint);
  
  // Search API returns items array, whereas user/repos returns array directly
  const reposArray = search ? data.items : data;

  return mapRepositories(reposArray);
};

exports.getBranches = async (userId, owner, repo) => {
  const client = await getGitHubClientForUser(userId);
  
  // Get repository details first to find default branch
  const repoDetails = await client.get(`/repos/${owner}/${repo}`);
  const defaultBranch = repoDetails.default_branch;

  // Now fetch branches (assuming max 100 for now, though real implementation might need pagination)
  const branchesData = await client.get(`/repos/${owner}/${repo}/branches?per_page=100`);

  return require('../mappers/branch.mapper').mapBranches(branchesData, defaultBranch);
};
