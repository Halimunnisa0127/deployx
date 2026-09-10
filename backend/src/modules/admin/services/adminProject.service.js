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
      if (status === 'active') {
        query.status = { $in: ['live', 'building', 'draft'] };
      } else if (status === 'archived') {
        query.status = 'archived';
      } else if (status === 'failed') {
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

    const mappedProjects = projects.map(p => {
      let mappedStatus = 'active';
      if (p.status === 'archived') {
        mappedStatus = 'archived';
      } else if (p.status === 'failed') {
        mappedStatus = 'failed';
      }

      return {
        id: p._id,
        _id: p._id,
        name: p.name,
        slug: p.slug,
        owner: p.owner ? p.owner.fullName : 'Unknown',
        ownerEmail: p.owner ? p.owner.email : '',
        framework: p.framework,
        status: mappedStatus,
        rawStatus: p.status,
        region: p.region,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        domainUrl: p.domainUrl,
        gitRepository: p.gitRepository,
        buildSettings: p.buildSettings,
        envVarsCount: p.environmentVariables ? p.environmentVariables.length : 0,
      };
    });

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

    let mappedStatus = 'active';
    if (p.status === 'archived') {
      mappedStatus = 'archived';
    } else if (p.status === 'failed') {
      mappedStatus = 'failed';
    }

    return {
      id: p._id,
      _id: p._id,
      name: p.name,
      slug: p.slug,
      owner: p.owner ? p.owner.fullName : 'Unknown',
      ownerEmail: p.owner ? p.owner.email : '',
      framework: p.framework,
      status: mappedStatus,
      rawStatus: p.status,
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
    p.status = 'archived';
    await p.save();
    return { id: p._id, status: 'archived' };
  }

  static async deleteProject(id) {
    const project = await Project.findById(id);
    if (!project) {
      throw new ApiError('Project not found', StatusCodes.NOT_FOUND);
    }

    const Domain = require('../../domains/models/Domain');
    const Deployment = require('../../deployments/models/Deployment');
    const DockerClient = require('../../../infrastructure/docker/docker.client');

    // 1. Safely cancel active (queued or building) deployments and clean up their build containers
    try {
      const activeDeployments = await Deployment.find({
        project: id,
        status: { $in: ['queued', 'building'] }
      });

      for (const dep of activeDeployments) {
        dep.status = 'cancelled';
        dep.errorMessage = 'Project was deleted by administrator';
        await dep.save().catch(() => {});

        try {
          await DockerClient.stopDeploymentContainer(dep._id);
          await DockerClient.removeDeploymentContainer(dep._id);
        } catch (dockerErr) {
          // Ignore container cleanup errors
        }
      }
    } catch (depErr) {
      // Safe fallback if deployment query fails
    }

    // 2. Safely stop and remove active runtime containers for this project
    try {
      await DockerClient.removePreviousRuntimeContainers(id);
    } catch (runtimeErr) {
      // Ignore if Docker is unreachable
    }

    // 3. Atomically delete domains and project using session transaction if supported
    const mongoose = require('mongoose');
    let session = null;
    if (mongoose.connection && mongoose.connection.readyState === 1 && typeof mongoose.startSession === 'function') {
      try {
        session = await mongoose.startSession();
      } catch (err) {
        session = null;
      }
    }
    let transactionSuccess = false;

    if (session) {
      try {
        await session.withTransaction(async () => {
          await Domain.deleteMany({ project: id }, { session });
          await Project.deleteOne({ _id: id }, { session });
        });
        transactionSuccess = true;
      } catch (txnError) {
        // Standalone MongoDB without replica set fallback
      } finally {
        await session.endSession().catch(() => {});
      }
    }


    if (!transactionSuccess) {
      try {
        await Domain.deleteMany({ project: id });
      } catch (domainErr) {
        // Ignore if Domain model not available
      }

      const result = await Project.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        throw new ApiError('Project not found', StatusCodes.NOT_FOUND);
      }
    }

    return { success: true };
  }
}

module.exports = AdminProjectService;
