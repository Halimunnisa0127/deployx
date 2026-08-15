const Project = require('../../projects/models/Project');
const { StatusCodes } = require('http-status-codes');
const { ApiError } = require('../../../shared/errors/ApiError');

class AdminProjectService {
  static async listProjects({ page = 1, limit = 10, search = '', status = '', framework = '' }) {
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) {
      // map frontend 'active' / 'archived' statuses safely to live/failed
      if (status === 'active') {
        query.status = { $in: ['live', 'building'] };
      } else if (status === 'archived') {
        query.status = 'failed';
      } else {
        query.status = status;
      }
    }
    if (framework && framework !== 'all') {
      query.framework = framework;
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .populate('owner', 'fullName email')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const mappedProjects = projects.map(p => ({
      id: p._id,
      _id: p._id,
      name: p.name,
      slug: p.slug,
      owner: p.owner ? p.owner.fullName : 'Unknown',
      ownerEmail: p.owner ? p.owner.email : '',
      framework: p.framework,
      // Map live/building to 'active', failed to 'archived' to match frontend UI badge expectations
      status: p.status === 'failed' ? 'archived' : 'active',
      region: p.region,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      domainUrl: p.domainUrl,
      gitRepository: p.gitRepository,
      buildSettings: p.buildSettings,
      envVarsCount: p.environmentVariables ? p.environmentVariables.length : 0,
    }));

    return {
      projects: mappedProjects,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    };
  }

  static async getProject(id) {
    const p = await Project.findById(id).populate('owner', 'fullName email');
    if (!p) {
      throw new ApiError('Project not found', StatusCodes.NOT_FOUND);
    }
    return {
      id: p._id,
      _id: p._id,
      name: p.name,
      slug: p.slug,
      owner: p.owner ? p.owner.fullName : 'Unknown',
      ownerEmail: p.owner ? p.owner.email : '',
      framework: p.framework,
      status: p.status === 'failed' ? 'archived' : 'active',
      region: p.region,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      domainUrl: p.domainUrl,
      gitRepository: p.gitRepository,
      buildSettings: p.buildSettings,
      envVarsCount: p.environmentVariables ? p.environmentVariables.length : 0,
    };
  }

  static async archiveProject(id) {
    const p = await Project.findById(id);
    if (!p) {
      throw new ApiError('Project not found', StatusCodes.NOT_FOUND);
    }
    p.status = 'failed'; // Map archived to failed in DB
    await p.save();
    return { id: p._id, status: 'archived' };
  }

  static async deleteProject(id) {
    const result = await Project.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new ApiError('Project not found', StatusCodes.NOT_FOUND);
    }
    return { success: true };
  }
}

module.exports = AdminProjectService;
