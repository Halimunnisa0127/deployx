const Deployment = require('../../deployments/models/Deployment');
const { StatusCodes } = require('http-status-codes');
const { ApiError } = require('../../../shared/errors/ApiError');

class AdminDeploymentService {
  static async listDeployments({ page = 1, limit = 10, search = '', status = '' }) {
    const query = {};
    
    // Status filter mapping Mongoose to frontend
    if (status && status !== 'all') {
      if (status === 'success') {
        query.status = 'ready';
      } else if (status === 'running') {
        query.status = 'building';
      } else {
        query.status = status;
      }
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    if (search) {
      query.commitMessage = { $regex: search, $options: 'i' };
    }

    const total = await Deployment.countDocuments(query);
    const deployments = await Deployment.find(query)
      .populate('project', 'name slug framework')
      .populate('owner', 'fullName email')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const mappedDeployments = deployments.map(d => {
      let mappedStatus = d.status;
      if (d.status === 'ready') mappedStatus = 'success';
      if (d.status === 'building') mappedStatus = 'running';

      return {
        id: d._id,
        _id: d._id,
        project: d.project ? d.project.name : 'Unknown',
        projectName: d.project ? d.project.name : 'Unknown',
        projectId: d.project ? d.project._id : null,
        owner: d.owner ? d.owner.fullName : 'Unknown',
        ownerEmail: d.owner ? d.owner.email : '',
        framework: d.project ? d.project.framework : 'auto',
        environment: d.environment || 'Production',
        status: mappedStatus,
        region: d.region || 'auto',
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
        duration: d.duration ? `${Math.round(d.duration / 1000)}s` : '0s',
        triggeredBy: d.triggeredBy || 'Manual',
        latestCommit: d.commitMessage || d.commitHash || '',
        repository: d.source ? d.source.repositoryFullName : '',
        branch: d.branch || d.source?.branch || 'main',
        commitHash: d.commitHash || d.source?.commitSha || '',
      };
    });

    return {
      deployments: mappedDeployments,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    };
  }

  static async getDeployment(id) {
    const d = await Deployment.findById(id)
      .populate('project', 'name slug framework')
      .populate('owner', 'fullName email');
    
    if (!d) {
      throw new ApiError('Deployment not found', StatusCodes.NOT_FOUND);
    }

    let mappedStatus = d.status;
    if (d.status === 'ready') mappedStatus = 'success';
    if (d.status === 'building') mappedStatus = 'running';

    return {
      id: d._id,
      _id: d._id,
      project: d.project ? d.project.name : 'Unknown',
      projectName: d.project ? d.project.name : 'Unknown',
      projectId: d.project ? d.project._id : null,
      owner: d.owner ? d.owner.fullName : 'Unknown',
      ownerEmail: d.owner ? d.owner.email : '',
      framework: d.project ? d.project.framework : 'auto',
      environment: d.environment || 'Production',
      status: mappedStatus,
      region: d.region || 'auto',
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      duration: d.duration ? `${Math.round(d.duration / 1000)}s` : '0s',
      triggeredBy: d.triggeredBy || 'Manual',
      latestCommit: d.commitMessage || d.commitHash || '',
      repository: d.source ? d.source.repositoryFullName : '',
      branch: d.branch || d.source?.branch || 'main',
      commitHash: d.commitHash || d.source?.commitSha || '',
    };
  }

  static async cancelDeployment(id) {
    const deployment = await Deployment.findById(id);
    if (!deployment) {
      throw new ApiError('Deployment not found', StatusCodes.NOT_FOUND);
    }
    
    if (deployment.status !== 'queued' && deployment.status !== 'building') {
      throw new ApiError('Only queued or building deployments can be cancelled', StatusCodes.BAD_REQUEST);
    }

    deployment.status = 'cancelled';
    deployment.errorMessage = 'Cancelled by administrator';
    await deployment.save();

    const DockerClient = require('../../../infrastructure/docker/docker.client');
    try {
      await DockerClient.stopDeploymentContainer(id);
      await DockerClient.removeDeploymentContainer(id);
    } catch (err) {
      // Ignore
    }

    return deployment;
  }

  static async deleteDeployment(id) {
    const result = await Deployment.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new ApiError('Deployment not found', StatusCodes.NOT_FOUND);
    }
    return { success: true };
  }
}

module.exports = AdminDeploymentService;
