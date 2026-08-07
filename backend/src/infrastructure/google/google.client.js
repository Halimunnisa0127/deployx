const config = require('../../config/env/env');
const ApiError = require('../../shared/errors/ApiError');

class GoogleClient {
  constructor() {
    this.tokenUrl = 'https://oauth2.googleapis.com/token';
    this.profileUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';
    this.defaultTimeout = 10000;
  }

  async fetchWithTimeout(url, options = {}, timeout = this.defaultTimeout) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      if (error.name === 'AbortError') {
        throw new ApiError('Request to Google API timed out', 504);
      }
      throw new ApiError(`Google API request failed: ${error.message}`, 500);
    }
  }

  async fetchWithRetry(url, options = {}, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await this.fetchWithTimeout(url, options);
        if (!response.ok && response.status >= 500) {
          throw new Error(`Server error: ${response.status}`);
        }
        return response;
      } catch (error) {
        if (i === retries - 1) throw error;
        // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 500));
      }
    }
  }

  async exchangeCodeForToken(code) {
    const params = new URLSearchParams({
      client_id: config.google.clientId,
      client_secret: config.google.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: config.google.redirectUri,
    });

    const response = await this.fetchWithRetry(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(`Google OAuth Token Error: ${data.error_description || data.error || 'Unknown error'}`, 400);
    }

    return data;
  }

  async getUserProfile(accessToken) {
    const response = await this.fetchWithRetry(this.profileUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(`Google Profile Error: ${data.error?.message || 'Failed to fetch user profile'}`, 400);
    }

    return data;
  }
}

module.exports = new GoogleClient();
