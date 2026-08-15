const User = require('../../users/models/User');
const Project = require('../../projects/models/Project');
const { StatusCodes } = require('http-status-codes');
const { ApiError } = require('../../../shared/errors/ApiError');

class AdminUserService {
  static async listUsers({ page = 1, limit = 10, search = '', role = '', status = '' }) {
    const query = {};
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) {
      query.role = role;
    }
    if (status) {
      query.isActive = status === 'active';
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const users = await User.find(query).skip(skip).limit(limitNum).sort({ createdAt: -1 });

    const populatedUsers = [];
    for (const u of users) {
      const pCount = await Project.countDocuments({ owner: u._id });
      populatedUsers.push({
        id: u._id,
        _id: u._id,
        fullName: u.fullName,
        name: u.fullName,
        email: u.email,
        role: u.role,
        avatar: u.avatar,
        bio: u.bio,
        isActive: u.isActive,
        status: u.isActive ? 'active' : 'suspended',
        projectsCount: pCount,
        joinedAt: u.createdAt,
        lastLogin: u.lastLogin,
      });
    }

    return {
      users: populatedUsers,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    };
  }

  static async getUser(id) {
    const u = await User.findById(id);
    if (!u) {
      throw new ApiError('User not found', StatusCodes.NOT_FOUND);
    }
    const pCount = await Project.countDocuments({ owner: u._id });
    return {
      id: u._id,
      _id: u._id,
      fullName: u.fullName,
      name: u.fullName,
      email: u.email,
      role: u.role,
      avatar: u.avatar,
      bio: u.bio,
      isActive: u.isActive,
      status: u.isActive ? 'active' : 'suspended',
      projectsCount: pCount,
      joinedAt: u.createdAt,
      lastLogin: u.lastLogin,
    };
  }

  static async createUser(data) {
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      throw new ApiError('Email already registered', StatusCodes.BAD_REQUEST);
    }

    const u = await User.create({
      fullName: data.fullName || data.name,
      email: data.email,
      password: data.password || 'TemporaryPassword123!',
      role: data.role || 'user',
      isActive: data.status === 'active' || data.isActive !== false,
    });

    return {
      id: u._id,
      _id: u._id,
      fullName: u.fullName,
      name: u.fullName,
      email: u.email,
      role: u.role,
      isActive: u.isActive,
      status: u.isActive ? 'active' : 'suspended',
      projectsCount: 0,
      joinedAt: u.createdAt,
    };
  }

  static async updateUser(id, data) {
    const u = await User.findById(id);
    if (!u) {
      throw new ApiError('User not found', StatusCodes.NOT_FOUND);
    }

    if (data.fullName !== undefined) u.fullName = data.fullName;
    if (data.name !== undefined) u.fullName = data.name;
    if (data.role !== undefined) u.role = data.role;
    if (data.status !== undefined) u.isActive = data.status === 'active';
    if (data.isActive !== undefined) u.isActive = data.isActive;

    await u.save();
    const pCount = await Project.countDocuments({ owner: u._id });
    return {
      id: u._id,
      _id: u._id,
      fullName: u.fullName,
      name: u.fullName,
      email: u.email,
      role: u.role,
      isActive: u.isActive,
      status: u.isActive ? 'active' : 'suspended',
      projectsCount: pCount,
      joinedAt: u.createdAt,
    };
  }

  static async deleteUser(id) {
    const result = await User.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new ApiError('User not found', StatusCodes.NOT_FOUND);
    }
    return { success: true };
  }
}

module.exports = AdminUserService;
