const ApiError = require('../../shared/errors/ApiError');

/**
 * Maps Axios errors from the GitHub API into internal ApiErrors.
 */
exports.mapGitHubError = (error) => {
  if (!error.response) {
    return new ApiError(500, 'GitHub connection failed');
  }

  const { status, data } = error.response;
  const message = data?.message || 'GitHub API Error';

  switch (status) {
    case 401:
      return new ApiError(401, `GitHub Bad Credentials: ${message}`);
    case 403:
      if (message.toLowerCase().includes('rate limit')) {
        return new ApiError(429, 'GitHub Rate Limit Exceeded');
      }
      return new ApiError(403, `GitHub Forbidden: ${message}`);
    case 404:
      return new ApiError(404, `GitHub Resource Not Found: ${message}`);
    default:
      return new ApiError(status, `GitHub API Error: ${message}`);
  }
};
