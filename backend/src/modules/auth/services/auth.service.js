const User = require('../../users/models/User');
const { jwtHelper } = require('../../../utils');
const ConflictError = require('../../../shared/errors/ConflictError');
const UnauthorizedError = require('../../../shared/errors/UnauthorizedError');
const NotFoundError = require('../../../shared/errors/NotFoundError');

class AuthService {
  async register({ fullName, email, password }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError('Email already in use');
    }

    const user = await User.create({ fullName, email, password });
    user.password = undefined;
    
    const accessToken = jwtHelper.generateAccessToken(user._id, user.role);
    const refreshToken = jwtHelper.generateRefreshToken(user._id, user.refreshTokenVersion);

    return { user, accessToken, refreshToken };
  }

  async login({ email, password }) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account is disabled');
    }

    user.lastLogin = new Date();
    await user.save();
    user.password = undefined;

    const accessToken = jwtHelper.generateAccessToken(user._id, user.role);
    const refreshToken = jwtHelper.generateRefreshToken(user._id, user.refreshTokenVersion);

    return { user, accessToken, refreshToken };
  }

  async refreshTokens(token) {
    try {
      const decoded = jwtHelper.verifyRefreshToken(token);
      const user = await User.findById(decoded.id);

      if (!user || user.refreshTokenVersion !== decoded.version || !user.isActive) {
        throw new UnauthorizedError('Invalid or expired refresh token');
      }

      const accessToken = jwtHelper.generateAccessToken(user._id, user.role);
      const refreshToken = jwtHelper.generateRefreshToken(user._id, user.refreshTokenVersion);

      return { user, accessToken, refreshToken };
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired refresh token');
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
      throw new NotFoundError('User not found');
    }
    return user;
  }
}

module.exports = new AuthService();
