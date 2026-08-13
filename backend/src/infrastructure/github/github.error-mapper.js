const ApiError = require('../../shared/errors/ApiError');

/**
 * Maps Axios errors from the GitHub API into internal ApiErrors.
 */
exports.mapGitHubError = (error) => {
  if (!error.response) {
    return new ApiError('GitHub connection failed', 500);
  }

  const { status, data } = error.response;
  const message = data?.message || 'GitHub API Error';

  switch (status) {
    case 401:
      return new ApiError(`GitHub Bad Credentials: ${message}`, 401);
    case 403:
      if (message.toLowerCase().includes('rate limit')) {
        return new ApiError('GitHub Rate Limit Exceeded', 429);
      }
      return new ApiError(`GitHub Forbidden: ${message}`, 403);
    case 404:
      return new ApiError(`GitHub Resource Not Found: ${message}`, 404);
    default:
      return new ApiError(`GitHub API Error: ${message}`, status);
  }
};
