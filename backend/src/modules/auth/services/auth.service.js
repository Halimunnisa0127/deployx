const User = require('../../users/models/User');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../../../utils/helpers/jwt.helper');

class AuthService {
  async register({ name, email, password }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const err = new Error('Email already in use');
      err.statusCode = 409;
      throw err;
    }

    const user = await User.create({ name, email, password });
    user.password = undefined;
    
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.refreshTokenVersion);

    return { user, accessToken, refreshToken };
  }

  async login({ email, password }) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

    if (!user.isActive) {
      const err = new Error('Account is disabled');
      err.statusCode = 403;
      throw err;
    }

    user.lastLogin = new Date();
    await user.save();
    user.password = undefined;

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.refreshTokenVersion);

    return { user, accessToken, refreshToken };
  }

  async refreshTokens(token) {
    try {
      const decoded = verifyRefreshToken(token);
      const user = await User.findById(decoded.id);

      if (!user || user.refreshTokenVersion !== decoded.version || !user.isActive) {
        const err = new Error('Invalid or expired refresh token');
        err.statusCode = 401;
        throw err;
      }

      const accessToken = generateAccessToken(user._id, user.role);
      const refreshToken = generateRefreshToken(user._id, user.refreshTokenVersion);

      return { user, accessToken, refreshToken };
    } catch (error) {
      const err = new Error('Invalid or expired refresh token');
      err.statusCode = 401;
      throw err;
    }
  }

  async logout(userId) {
    const user = await User.findById(userId);
    if (user) {
      user.refreshTokenVersion += 1;
      await user.save();
    }
  }
  
  async getCurrentUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }
    return user;
  }
}

module.exports = new AuthService();
