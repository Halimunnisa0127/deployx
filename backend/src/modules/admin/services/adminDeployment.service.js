const Deployment = require('../../deployments/models/Deployment');
const { StatusCodes } = require('http-status-codes');
const { ApiError } = require('../../../shared/errors/ApiError');

function formatBytes(bytes) {
  if (!bytes || bytes === 0 || isNaN(bytes)) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function calculateDuration(dep) {
  if (dep.startedAt && dep.completedAt) {
    const diff = Math.max(0, Math.round((new Date(dep.completedAt) - new Date(dep.startedAt)) / 1000));
    return `${diff}s`;
  }
  if (dep.createdAt && dep.completedAt) {
    const diff = Math.max(0, Math.round((new Date(dep.completedAt) - new Date(dep.createdAt)) / 1000));
    return `${diff}s`;
  }
  if (dep.status === 'building' && dep.startedAt) {
    const diff = Math.max(0, Math.round((Date.now() - new Date(dep.startedAt)) / 1000));
    return `${diff}s`;
  }
  return '0s';
}

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
      query.$or = [
        { commitMessage: { $regex: search, $options: 'i' } },
        { commitHash: { $regex: search, $options: 'i' } },
        { triggeredBy: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Deployment.countDocuments(query);
    const deployments = await Deployment.find(query)
      .populate('project', 'name slug framework domainUrl')
      .populate('owner', 'fullName email')
      .populate('artifact', 'size fileCount checksum originalOutputDirectory')
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
        framework: d.project ? d.project.framework : (d.buildSettings?.framework || 'auto'),
        environment: d.environment || 'Production',
        status: mappedStatus,
        rawStatus: d.status,
        region: d.region || 'auto',
        domain: d.project?.domainUrl || d.url || (d.project ? `https://${d.project.slug}.deployx.app` : ''),
        url: d.url || (d.project ? `https://${d.project.slug}.deployx.app` : ''),
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
        startedAt: d.startedAt,
        completedAt: d.completedAt,
        duration: calculateDuration(d),
        triggeredBy: d.triggeredBy || 'Manual',
        latestCommit: d.commitMessage || d.source?.commitMessage || d.commitHash || '',
        commit: d.commitHash || d.source?.commitSha || '',
        commitMessage: d.commitMessage || d.source?.commitMessage || '',
        author: d.owner ? d.owner.fullName : 'Developer',
        repository: d.source ? d.source.repositoryFullName : '',
        branch: d.branch || d.source?.branch || 'main',
        commitHash: d.commitHash || d.source?.commitSha || '',
        artifactSize: d.artifact ? formatBytes(d.artifact.size) : null,
        rawArtifactSize: d.artifact ? d.artifact.size : null,
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
      .populate('project', 'name slug framework domainUrl')
      .populate('owner', 'fullName email')
      .populate('artifact');
    
    if (!d) {
      throw new ApiError('Deployment not found', StatusCodes.NOT_FOUND);
    }

    let mappedStatus = d.status;
    if (d.status === 'ready') mappedStatus = 'success';
    if (d.status === 'building') mappedStatus = 'running';

    // Construct execution timeline based on real timestamps
    const timeline = [];
    if (d.createdAt) {
      timeline.push({
        step: 'Queued',
        status: 'completed',
        time: new Date(d.createdAt).toLocaleTimeString(),
        timestamp: d.createdAt,
      });
    }
    if (d.startedAt || d.status === 'building' || d.status === 'ready' || d.status === 'failed' || d.status === 'cancelled') {
      timeline.push({
        step: 'Building',
        status: d.status === 'queued' ? 'pending' : (d.status === 'building' ? 'active' : 'completed'),
        time: d.startedAt ? new Date(d.startedAt).toLocaleTimeString() : 'In Progress',
        timestamp: d.startedAt,
      });
    }
    if (d.completedAt || d.status === 'ready' || d.status === 'failed' || d.status === 'cancelled') {
      let finalStep = 'Completed';
      let finalStatus = 'completed';
      if (d.status === 'failed') {
        finalStep = 'Failed';
        finalStatus = 'failed';
      } else if (d.status === 'cancelled') {
        finalStep = 'Cancelled';
        finalStatus = 'cancelled';
      }
      timeline.push({
        step: finalStep,
        status: finalStatus,
        time: d.completedAt ? new Date(d.completedAt).toLocaleTimeString() : 'Finalized',
        timestamp: d.completedAt || d.updatedAt,
      });
    }

    // Real measured artifact metadata
    const artifactData = d.artifact ? {
      id: d.artifact._id,
      size: d.artifact.size,
      formattedSize: formatBytes(d.artifact.size),
      fileCount: d.artifact.fileCount,
      checksum: d.artifact.checksum,
      outputDirectory: d.artifact.originalOutputDirectory,
      storageKey: d.artifact.storageKey,
      storageProvider: d.artifact.storageProvider,
    } : null;

    return {
      id: d._id,
      _id: d._id,
      project: d.project ? d.project.name : 'Unknown',
      projectName: d.project ? d.project.name : 'Unknown',
      projectId: d.project ? d.project._id : null,
      owner: d.owner ? d.owner.fullName : 'Unknown',
      ownerEmail: d.owner ? d.owner.email : '',
      framework: d.project ? d.project.framework : (d.buildSettings?.framework || 'auto'),
      environment: d.environment || 'Production',
      status: mappedStatus,
      rawStatus: d.status,
      region: d.region || 'auto',
      domain: d.project?.domainUrl || d.url || (d.project ? `https://${d.project.slug}.deployx.app` : ''),
      url: d.url || (d.project ? `https://${d.project.slug}.deployx.app` : ''),
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      startedAt: d.startedAt,
      completedAt: d.completedAt,
      duration: calculateDuration(d),
      compute: d.buildSettings?.nodeVersion ? `Node.js ${d.buildSettings.nodeVersion}` : 'Container (2 vCPU / 4GB)',
      triggeredBy: d.triggeredBy || 'Manual',
      latestCommit: d.commitMessage || d.source?.commitMessage || d.commitHash || '',
      commit: d.commitHash || d.source?.commitSha || '',
      commitMessage: d.commitMessage || d.source?.commitMessage || 'Manual Deployment',
      author: d.owner ? d.owner.fullName : 'Developer',
      repository: d.source ? d.source.repositoryFullName : '',
      branch: d.branch || d.source?.branch || 'main',
      commitHash: d.commitHash || d.source?.commitSha || '',
      errorMessage: d.errorMessage || null,
      timeline,
      artifact: artifactData,
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
    deployment.completedAt = new Date();
    await deployment.save();

    const DockerClient = require('../../../infrastructure/docker/docker.client');
    const NotificationService = require('../../notifications/services/notification.service');

    try {
      await DockerClient.stopDeploymentContainer(id);
      await DockerClient.removeDeploymentContainer(id);
    } catch (err) {
      // Ignore
    }

    if (deployment.owner) {
      await NotificationService.createNotification({
        recipient: deployment.owner,
        type: 'warning',
        category: 'deployment',
        title: 'Deployment Cancelled',
        message: `Deployment #${deployment.deploymentNumber || ''} was cancelled by an administrator.`,
        deployment: deployment._id,
        project: deployment.project,
      });
    }

    return deployment;
  }

  static async deleteDeployment(id) {
    const deployment = await Deployment.findById(id);
    if (!deployment) {
      throw new ApiError('Deployment not found', StatusCodes.NOT_FOUND);
    }

    const DockerClient = require('../../../infrastructure/docker/docker.client');
    const Artifact = require('../../storage/models/Artifact');
    const LocalArtifactStorageProvider = require('../../storage/providers/LocalArtifactStorageProvider');
    const DeploymentLog = require('../../logs/models/DeploymentLog');
    const LogSequence = require('../../logs/models/LogSequence');

    // 1. Clean up build/runtime containers
    try {
      await DockerClient.stopDeploymentContainer(id);
      await DockerClient.removeDeploymentContainer(id);
    } catch (err) {
      // Ignore docker errors
    }

    // 2. Clean up artifact file and record if exists
    try {
      if (deployment.artifact) {
        const artifact = await Artifact.findById(deployment.artifact);
        if (artifact && artifact.storageKey) {
          const storageProvider = new LocalArtifactStorageProvider();
          await storageProvider.delete(artifact.storageKey).catch(() => {});

        }
        await Artifact.deleteOne({ _id: deployment.artifact });
      }
    } catch (err) {
      // Ignore
    }

    // 3. Clean up logs
    try {
      await DeploymentLog.deleteMany({ deployment: id });
      await LogSequence.deleteMany({ deployment: id });
    } catch (err) {
      // Ignore
    }

    // 4. Delete deployment
    await Deployment.deleteOne({ _id: id });
    return { success: true };
  }
}

module.exports = AdminDeploymentService;
