const crypto = require('crypto');
const User = require('../../users/models/User');
const { jwtHelper } = require('../../../utils');
const ConflictError = require('../../../shared/errors/ConflictError');
const UnauthorizedError = require('../../../shared/errors/UnauthorizedError');
const NotFoundError = require('../../../shared/errors/NotFoundError');
const BadRequestError = require('../../../shared/errors/BadRequestError');
const { sendEmail } = require('../../../utils/helpers/email.helper');

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
    const tokensToCheck = Array.isArray(token) ? token : [token];

    for (const t of tokensToCheck) {
      try {
        const decoded = jwtHelper.verifyRefreshToken(t);
        if (!decoded) continue;

        const user = await User.findById(decoded.id);
        if (!user || user.refreshTokenVersion !== decoded.version || !user.isActive) {
          continue; // Outdated version or disabled user, try next cookie
        }

        // Found the valid token matching the database session version!
        const accessToken = jwtHelper.generateAccessToken(user._id, user.role);
        const refreshToken = jwtHelper.generateRefreshToken(user._id, user.refreshTokenVersion);

        return { user, accessToken, refreshToken };
      } catch (e) {
        // Verification or lookup failed for this token, try next
      }
    }

    // None of the provided cookies were valid
    throw new UnauthorizedError('Invalid or expired refresh token');
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

  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't leak whether user exists or not, just return true
      return true;
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiry to 10 minutes from now
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 10);

    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpiry = expiry;
    await user.save();

    // Send email
    await sendEmail({
      to: email,
      subject: 'Password Reset OTP',
      text: `Your password reset OTP is ${otp}. It will expire in 10 minutes.`,
      html: `<p>Your password reset OTP is <strong>${otp}</strong>.</p><p>It will expire in 10 minutes.</p>`
    });

    return true;
  }

  async resetPassword(email, otp, newPassword) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError('Invalid OTP or Email');
    }

    if (!user.resetPasswordOtp || user.resetPasswordOtp !== otp) {
      throw new BadRequestError('Invalid OTP');
    }

    if (new Date() > user.resetPasswordOtpExpiry) {
      throw new BadRequestError('OTP has expired');
    }

    user.password = newPassword; // Will be hashed by pre-save hook
    user.resetPasswordOtp = null;
    user.resetPasswordOtpExpiry = null;
    await user.save();

    return true;
  }
}

module.exports = new AuthService();
