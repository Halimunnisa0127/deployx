require('dotenv').config();
const { Worker } = require('bullmq');
const mongoose = require('mongoose');
const os = require('os');
const crypto = require('crypto');
const config = require('../config/env/env');
const redisConnection = require('../infrastructure/queue/redis');
const DockerClient = require('../infrastructure/docker/docker.client');
const Deployment = require('../modules/deployments/models/Deployment');
const Project = require('../modules/projects/models/Project');
const GitHubAccount = require('../modules/integrations/github/models/GitHubAccount');
const { decrypt } = require('../utils/helpers/encryption.helper');
const EncryptionUtil = require('../shared/utils/encryption.util');
const deploymentLogService = require('../modules/logs/services/deploymentLog.service');
const ArtifactService = require('../modules/storage/services/artifact.service');
const logger = require('../config/logger/logger');

// Generate unique worker identity at process startup
const workerId = `worker-${os.hostname()}-${process.pid}-${crypto.randomBytes(4).toString('hex')}`;

// Initialize MongoDB connection for the worker
mongoose.connect(config.mongoUri)
  .then(() => logger.info({ event: 'worker.started', workerId }, '[Worker] Connected to MongoDB'))
  .catch((err) => {
    logger.fatal({ event: 'worker.error', errorCode: 'WORKER_ERROR', workerId, err: err.message }, '[Worker] MongoDB connection error');
    process.exit(1);
  });

const worker = new Worker('deployments', async (job) => {
  const { deploymentId } = job.data;
  logger.info({ deploymentId, jobId: job.id, workerId, event: 'deployment.processing', status: 'queued' }, '[Worker] Processing deployment job');

  let executionStage = 'init';

  // Fetch Deployment
  const deployment = await Deployment.findById(deploymentId);
  if (!deployment) {
    throw new Error(`Deployment ${deploymentId} not found`);
  }

  // Prevent transitions from terminal states
  if (['ready', 'failed', 'cancelled'].includes(deployment.status)) {
    logger.info({ deploymentId, jobId: job.id, workerId, status: deployment.status, event: 'deployment.processing' }, 'Deployment already in terminal state. Skipping.');
    return;
  }

  // Docker Container status lookup
  const container = await DockerClient.findDeploymentContainer(deploymentId);
  let isContainerRunning = false;
  if (container) {
    try {
      const info = await container.inspect();
      isContainerRunning = info.State.Running;
    } catch (err) {
      // Container unreachable or already deleted
    }
  }

  // Handle building deployment state checks (reconciliation/recovery)
  if (deployment.status === 'building') {
    if (isContainerRunning && container) {
      logger.info({ deploymentId, jobId: job.id, workerId, event: 'deployment.processing' }, 'Build container is already running. Re-attaching to wait for completion.');
      
      try {
        const startTime = Date.now();
        const waitResult = await container.wait();
        if (waitResult.StatusCode !== 0) {
          throw new Error(`Re-attached container exited with status: ${waitResult.StatusCode}`);
        }

        await deploymentLogService.appendLog(deploymentId, deployment.project, 'info', 'Re-attached container succeeded. Collecting artifacts...');
        await ArtifactService.extractAndStoreArtifact(container, deployment, async (level, msg) => {
          await deploymentLogService.appendLog(deploymentId, deployment.project, level, msg);
        });

        await deploymentLogService.appendLog(deploymentId, deployment.project, 'info', 'Cleaning up previous runtime containers...');
        await DockerClient.removePreviousRuntimeContainers(deployment.project);

        await deploymentLogService.appendLog(deploymentId, deployment.project, 'info', 'Spawning production Nginx runtime serving container...');
        const updatedDep = await Deployment.findById(deploymentId).populate('artifact');
        if (!updatedDep || !updatedDep.artifact) {
          throw new Error('Deployment or associated artifact not found for runtime serving setup.');
        }
        const runtimeInfo = await DockerClient.startRuntimeContainer(updatedDep, updatedDep.artifact);

        const duration = Date.now() - startTime;

        const latestDeployment = await Deployment.findOneAndUpdate(
          { _id: deploymentId, status: 'building' },
          {
            status: 'ready',
            completedAt: new Date(),
            stepCompleted: 6,
            duration,
            runtimeContainerId: runtimeInfo.containerId,
            runtimePort: runtimeInfo.port,
            url: `http://localhost:${runtimeInfo.port}`
          },
          { new: true }
        );

        if (latestDeployment) {
          await deploymentLogService.appendLog(deploymentId, deployment.project, 'success', `Deployment recovered and completed successfully. serving on port ${runtimeInfo.port}`);
          logger.info({ deploymentId, jobId: job.id, workerId, duration, event: 'deployment.build.completed', status: 'ready' }, '[Worker] Re-attached deployment recovered successfully');
        }
        return;
      } catch (recoveryErr) {
        logger.error({ deploymentId, jobId: job.id, workerId, event: 'deployment.failed', err: recoveryErr.message }, 'Failed to recover active building container');
        await Deployment.findOneAndUpdate(
          { _id: deploymentId, status: 'building' },
          { status: 'failed', errorMessage: `Recovery failed: ${recoveryErr.message}` }
        );
        throw recoveryErr;
      }
    } else {
      logger.warn({ deploymentId, jobId: job.id, workerId, event: 'deployment.processing' }, 'Deployment status is building but container is dead/missing. Failing previous run.');
      await Deployment.findOneAndUpdate(
        { _id: deploymentId, status: 'building' },
        { status: 'failed', errorMessage: 'Build environment was abruptly terminated.' }
      );
      throw new Error('Worker execution failed. Reason: Previous build environment was abruptly terminated.');
    }
  }

  // Handle queued deployment state checks
  if (deployment.status === 'queued') {
    if (container) {
      logger.warn({ deploymentId, jobId: job.id, workerId }, 'Found legacy container for queued deployment. Cleaning up.');
      await DockerClient.removeDeploymentContainer(deploymentId);
    }

    // Atomically transition from queued to building
    const updated = await Deployment.findOneAndUpdate(
      { _id: deploymentId, status: 'queued' },
      { status: 'building', startedAt: new Date() },
      { new: true }
    );

    if (!updated) {
      logger.info({ deploymentId, jobId: job.id, workerId }, 'Deployment status changed from queued before build started. Aborting.');
      return;
    }
  }

  await deploymentLogService.appendLog(deploymentId, deployment.project, 'info', 'Deployment marked as building. Starting secure isolated environment...');
  logger.info({ deploymentId, jobId: job.id, workerId, event: 'deployment.build.started', status: 'building' }, '[Worker] Deployment transitioned to building');

  try {
    executionStage = 'setup';
    // Secure GitHub Token Retrieval
    await deploymentLogService.appendLog(deploymentId, deployment.project, 'info', 'Resolving and authenticating with source provider...');
    const githubAccount = await GitHubAccount.findOne({ userId: deployment.owner });
    if (!githubAccount) {
      throw new Error(`GitHub account not found for deployment owner ${deployment.owner}`);
    }
    const githubToken = decrypt(githubAccount.encryptedAccessToken);

    // Project Environment Variable Secure Decryption
    await deploymentLogService.appendLog(deploymentId, deployment.project, 'info', 'Injecting scoped environment variables...');
    const project = await Project.findById(deployment.project);
    if (!project) {
      throw new Error(`Project ${deployment.project} not found`);
    }

    const envVars = {};
    if (project.environmentVariables && project.environmentVariables.length > 0) {
      const scopedVars = project.environmentVariables.filter(env => 
        env.environments && env.environments.includes(deployment.environment)
      );

      for (const env of scopedVars) {
        if (env.isEncrypted) {
          envVars[env.key] = EncryptionUtil.decrypt(env.value, env.iv, env.authTag);
        } else {
          envVars[env.key] = env.value; // Legacy plaintext
        }
      }
    }

    executionStage = 'build';
    // Docker Build Execution
    logger.info({ deploymentId, jobId: job.id, workerId, event: 'deployment.build.started' }, '[Worker] Executing real Docker build');
    await deploymentLogService.appendLog(deploymentId, deployment.project, 'info', 'Executing isolated Docker build pipeline...');
    
    const startTime = Date.now();
    
    // Pass onLog callback to stream chunks from docker directly to mongodb safely
    // Pass onSuccess to safely extract the artifact before the container is wiped
    await DockerClient.runBuild(
      deployment, 
      githubToken, 
      envVars, 
      (level, chunk) => {
        deploymentLogService.appendLog(deploymentId, deployment.project, level, chunk, envVars);
      },
      async (container) => {
        await deploymentLogService.appendLog(deploymentId, deployment.project, 'info', 'Artifact collection started...');
        await ArtifactService.extractAndStoreArtifact(container, deployment, async (level, msg) => {
           await deploymentLogService.appendLog(deploymentId, deployment.project, level, msg);
        });
        await deploymentLogService.appendLog(deploymentId, deployment.project, 'info', 'Artifact collection completed.');
      }
    );
    
    // Spawning production Nginx serving runtime container
    await deploymentLogService.appendLog(deploymentId, deployment.project, 'info', 'Cleaning up previous runtime containers...');
    await DockerClient.removePreviousRuntimeContainers(deployment.project);

    await deploymentLogService.appendLog(deploymentId, deployment.project, 'info', 'Spawning production Nginx runtime serving container...');
    const updatedDep = await Deployment.findById(deploymentId).populate('artifact');
    if (!updatedDep || !updatedDep.artifact) {
      throw new Error('Deployment or associated artifact not found for runtime serving setup.');
    }
    const runtimeInfo = await DockerClient.startRuntimeContainer(updatedDep, updatedDep.artifact);

    const duration = Date.now() - startTime;

    // Complete Transition atomically building -> ready with runtime metadata
    const latestDeployment = await Deployment.findOneAndUpdate(
      { _id: deploymentId, status: 'building' },
      {
        status: 'ready',
        completedAt: new Date(),
        stepCompleted: 6,
        duration,
        runtimeContainerId: runtimeInfo.containerId,
        runtimePort: runtimeInfo.port,
        url: `http://localhost:${runtimeInfo.port}`
      },
      { new: true }
    );

    if (!latestDeployment) {
      logger.info({ deploymentId, jobId: job.id, workerId, event: 'deployment.build.completed', status: 'cancelled' }, '[Worker] Deployment is no longer building (possibly cancelled). Cleaning up created runtime container.');
      try {
        const tempContainer = require('dockerode')().getContainer(runtimeInfo.containerId);
        await tempContainer.remove({ force: true });
      } catch (err) {}
      return;
    }

    await deploymentLogService.appendLog(deploymentId, deployment.project, 'success', `Deployment completed successfully in ${duration}ms! serving on port ${runtimeInfo.port}`);
    logger.info({ deploymentId, jobId: job.id, workerId, duration, event: 'deployment.build.completed', status: 'ready' }, '[Worker] Deployment transitioned to ready with active runtime');

  } catch (error) {
    // Sanitize error message to prevent leaking secrets in logs or API
    const sanitizedErrorMessage = error.message ? error.message.replace(/([0-9a-fA-F]{32,}|eyJhbGciOi[a-zA-Z0-9_-]+)/g, '[REDACTED]') : 'Unknown Error';
    
    let stableErrorCode = 'DEPLOYMENT_BUILD_FAILED';
    if (executionStage === 'init' || executionStage === 'setup') {
      stableErrorCode = 'DEPLOYMENT_PROCESSING_FAILED';
    }

    logger.error({ deploymentId, jobId: job.id, workerId, event: 'deployment.failed', errorCode: stableErrorCode, err: sanitizedErrorMessage }, '[Worker] Error processing deployment');
    
    const currentDeployment = await Deployment.findById(deploymentId);
    if (currentDeployment) {
      await deploymentLogService.appendLog(deploymentId, currentDeployment.project, 'error', `Deployment execution failed: ${sanitizedErrorMessage}`);
    }

    // Atomically transition from building to failed safely
    const updatedFail = await Deployment.findOneAndUpdate(
      { _id: deploymentId, status: 'building' },
      { status: 'failed', errorMessage: sanitizedErrorMessage },
      { new: true }
    );

    if (updatedFail) {
      logger.info({ deploymentId, jobId: job.id, workerId, event: 'deployment.failed', status: 'failed' }, '[Worker] Deployment marked as failed safely');
    }

    // Rethrow to allow BullMQ to handle queue retries
    throw new Error(`Worker execution failed. Reason: ${sanitizedErrorMessage}`);
  }
}, {
  connection: redisConnection,
  concurrency: 1,
  lockDuration: 30000,
  lockRenewTime: 15000,
  maxStalledCount: 2,
  stalledInterval: 30000,
});

worker.on('ready', () => {
  logger.info({ event: 'worker.started', workerId }, '[Worker] Deployment Worker is ready and listening to queue.');
});

worker.on('failed', (job, err) => {
  logger.error({ jobId: job.id, event: 'worker.error', errorCode: 'WORKER_ERROR', workerId, err: err.message }, '[Worker] Job failed');
});

worker.on('error', (err) => {
  logger.error({ event: 'worker.error', errorCode: 'WORKER_ERROR', workerId, err: err.message }, '[Worker] BullMQ Worker Error');
});

const HEARTBEAT_TTL = 30; // 30 seconds TTL
const updateHeartbeat = async () => {
  try {
    const key = `deployx:worker:heartbeat:${workerId}`;
    const data = JSON.stringify({
      workerId,
      status: 'active',
      lastHeartbeat: new Date().toISOString(),
      pid: process.pid,
      uptime: process.uptime(),
    });
    await redisConnection.set(key, data, 'EX', HEARTBEAT_TTL);
  } catch (err) {
    // Ignore heartbeat writing error
  }
};

updateHeartbeat();
const heartbeatInterval = setInterval(updateHeartbeat, 15000);

// Graceful Shutdown
const shutdown = async (signal) => {
  logger.info({ event: 'worker.shutdown', workerId }, `[Worker] Received ${signal}. Shutting down gracefully...`);
  clearInterval(heartbeatInterval);
  
  try {
    // Remove heartbeat key on clean shutdown
    await redisConnection.del(`deployx:worker:heartbeat:${workerId}`).catch(() => {});
    
    await worker.close();
    logger.info({ event: 'worker.shutdown', workerId }, '[Worker] BullMQ Worker closed.');
    
    await mongoose.disconnect();
    logger.info({ event: 'worker.shutdown', workerId }, '[Worker] MongoDB connection closed.');
    
    process.exit(0);
  } catch (err) {
    logger.error({ event: 'worker.error', errorCode: 'WORKER_ERROR', workerId, err: err.message }, '[Worker] Error during shutdown');
    process.exit(1);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

