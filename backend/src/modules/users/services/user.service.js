const User = require('../models/User');
const NotFoundError = require('../../../shared/errors/NotFoundError');
const ConflictError = require('../../../shared/errors/ConflictError');
const BadRequestError = require('../../../shared/errors/BadRequestError');
const UnauthorizedError = require('../../../shared/errors/UnauthorizedError');

class UserService {
  async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async updateProfile(userId, updateData) {
    if (updateData.username) {
      const existingUser = await User.findOne({ username: updateData.username, _id: { $ne: userId } });
      if (existingUser) {
        throw new ConflictError('Username is already taken');
      }
    }

    if (updateData.preferences) {
      const user = await User.findById(userId);
      updateData.preferences = { ...user.preferences, ...updateData.preferences };
    }

    delete updateData.email;
    delete updateData.password;
    delete updateData.role;
    delete updateData.refreshTokenVersion;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
    
    if (!updatedUser) {
      throw new NotFoundError('User not found');
    }

    return updatedUser;
  }

  async updatePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new UnauthorizedError('Incorrect current password');
    }

    user.password = newPassword;
    user.refreshTokenVersion += 1;
    
    await user.save();
    user.password = undefined;
    
    return user;
  }

  async updateAvatar(userId, file) {
    if (!file) {
      throw new BadRequestError('No file provided');
    }

    const mockAvatarUrl = `https://storage.deployx.local/avatars/${userId}_${Date.now()}.png`;
    
    const updatedUser = await User.findByIdAndUpdate(userId, { avatar: mockAvatarUrl }, { new: true });
    return updatedUser;
  }
}

module.exports = new UserService();
