// Temporary fetch abstraction if axios is not installed.
// We will use native fetch, but abstracting it inside the client.
const { GITHUB_API_URL } = require('../../modules/integrations/github/constants/github.constants');
const { mapGitHubError } = require('./github.error-mapper');
const ApiError = require('../../shared/errors/ApiError');

class GitHubClient {
  constructor(accessToken) {
    if (!accessToken) {
      throw new ApiError('GitHub Access Token is required', 401);
    }
    this.accessToken = accessToken;
  }

  getHeaders(includeAuth = true) {
    const headers = {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'DeployX',
    };
    if (includeAuth && this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }
    return headers;
  }

  async request(method, endpoint, body = null) {
    const url = `${GITHUB_API_URL}${endpoint}`;
    
    try {
      let response = await fetch(url, {
        method,
        headers: this.getHeaders(true),
        body: body ? JSON.stringify(body) : undefined,
      });

      // Graceful fallback for public repositories when the user's OAuth token has expired
      if (response.status === 401 && method === 'GET' && endpoint.startsWith('/repos/')) {
        try {
          const publicResponse = await fetch(url, {
            method: 'GET',
            headers: this.getHeaders(false),
          });
          if (publicResponse.status !== 401) {
            response = publicResponse;
          }
        } catch (pubErr) {
          // Ignore and proceed with original 401
        }
      }

      if (!response.ok) {
        let errorData = null;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: response.statusText };
        }
        
        // Mocking an axios-like response structure for the error mapper
        const mockAxiosError = {
          response: {
            status: response.status,
            data: errorData,
          },
        };
        throw mapGitHubError(mockAxiosError);
      }

      // 204 No Content
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      // If it's a network error
      const mockNetworkError = { response: null };
      throw mapGitHubError(mockNetworkError);
    }
  }

  async get(endpoint) {
    return this.request('GET', endpoint);
  }

  async post(endpoint, data) {
    return this.request('POST', endpoint, data);
  }

  async delete(endpoint) {
    return this.request('DELETE', endpoint);
  }
}

module.exports = GitHubClient;
