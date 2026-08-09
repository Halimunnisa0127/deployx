require('dotenv').config();
const mongoose = require('mongoose');
const os = require('os');
const crypto = require('crypto');
const config = require('../config/env/env');
const logger = require('../config/logger/logger');
const Deployment = require('../modules/deployments/models/Deployment');
const DockerClient = require('../infrastructure/docker/docker.client');
const deploymentQueue = require('../infrastructure/queue/deployment.queue');

const workerId = `reconciler-${os.hostname()}-${process.pid}-${crypto.randomBytes(4).toString('hex')}`;

// MongoDB Connection
mongoose.connect(config.mongoUri)
  .then(() => {
    logger.info({ event: 'reconciler.started', workerId }, '[Reconciler] Connected to MongoDB');
    startReconciliationLoop();
  })
  .catch((err) => {
    logger.fatal({ event: 'reconciler.error', workerId, err: err.message }, '[Reconciler] MongoDB connection error');
    process.exit(1);
  });

let intervalId;

async function reconcileStaleDeployments() {
  try {
    const now = new Date();
    
    // 1. Reconcile Stale Queued Deployments
    const queueTimeout = config.timeouts.deploymentQueueTimeoutMs;
    const queueCutoff = new Date(now.getTime() - queueTimeout);

    const staleQueued = await Deployment.find({
      status: 'queued',
      createdAt: { $lt: queueCutoff }
    });

    for (const dep of staleQueued) {
      const jobId = `deploy-${dep._id}`;
      try {
        const job = await deploymentQueue.getJob(jobId);
        if (!job) {
          // Atomically mark as failed if still queued
          const updated = await Deployment.findOneAndUpdate(
            { _id: dep._id, status: 'queued' },
            { status: 'failed', errorMessage: 'Queue timeout exceeded. Build execution was lost.' },
            { new: true }
          );
          if (updated) {
            logger.warn({ deploymentId: dep._id, workerId, event: 'reconciler.stale.queued' }, 'Marked stale queued deployment as failed.');
          }
        }
      } catch (jobErr) {
        logger.error({ deploymentId: dep._id, workerId, err: jobErr.message }, 'Failed to check BullMQ job state for queued deployment.');
      }
    }

    // 2. Reconcile Stale Building Deployments
    const buildTimeout = config.timeouts.deploymentBuildTimeoutMs;
    const buildCutoff = new Date(now.getTime() - buildTimeout);

    const staleBuilding = await Deployment.find({
      status: 'building',
      startedAt: { $lt: buildCutoff }
    });

    for (const dep of staleBuilding) {
      try {
        const container = await DockerClient.findDeploymentContainer(dep._id);
        let isRunning = false;
        if (container) {
          const info = await container.inspect();
          isRunning = info.State.Running;
        }

        if (!isRunning) {
          // Atomically mark as failed if still building
          const updated = await Deployment.findOneAndUpdate(
            { _id: dep._id, status: 'building' },
            { status: 'failed', errorMessage: 'Build execution exceeded maximum timeout. Environment lost.' },
            { new: true }
          );
          if (updated) {
            logger.warn({ deploymentId: dep._id, workerId, event: 'reconciler.stale.building' }, 'Marked stale building deployment without active container as failed.');
            // Clean container if it was in exit/dead state
            if (container) {
              await DockerClient.removeDeploymentContainer(dep._id);
            }
          }
        } else {
          // Container is still running. Let container timeout handle it, or log warning
          logger.info({ deploymentId: dep._id, workerId }, 'Stale building deployment has a running Docker container. Allowing it to continue.');
        }
      } catch (dockerErr) {
        logger.error({ deploymentId: dep._id, workerId, err: dockerErr.message }, 'Failed to reconcile building deployment container state.');
      }
    }

    // 3. Clean abandoned DeployX containers
    // Get all running or dead deployx containers and remove them if they don't match any active building deployments
    const Docker = require('dockerode');
    const docker = new Docker();
    const containers = await docker.listContainers({
      all: true,
      filters: JSON.stringify({
        label: ['deployx=true']
      })
    });

    for (const cInfo of containers) {
      const depId = cInfo.Labels.deploymentId;
      if (depId) {
        const activeDep = await Deployment.findOne({ _id: depId, status: 'building' });
        if (!activeDep) {
          logger.warn({ deploymentId: depId, workerId, containerId: cInfo.Id }, 'Found abandoned deployx build container. Removing.');
          try {
            const container = docker.getContainer(cInfo.Id);
            await container.remove({ force: true });
          } catch (cErr) {
            // ignore
          }
        }
      }
    }

  } catch (error) {
    logger.error({ event: 'reconciler.error', workerId, err: error.message }, 'Error in reconciliation tick');
  }
}

function startReconciliationLoop() {
  // Run once immediately
  reconcileStaleDeployments();
  // Run every 1 minute
  intervalId = setInterval(reconcileStaleDeployments, 60000);
}

// Graceful Shutdown
const shutdown = async (signal) => {
  logger.info({ event: 'reconciler.shutdown', workerId }, `[Reconciler] Received ${signal}. Shutting down gracefully...`);
  if (intervalId) clearInterval(intervalId);
  try {
    await mongoose.disconnect();
    logger.info({ event: 'reconciler.shutdown', workerId }, '[Reconciler] MongoDB connection closed.');
    process.exit(0);
  } catch (err) {
    logger.error({ event: 'reconciler.error', workerId, err: err.message }, '[Reconciler] Error during shutdown');
    process.exit(1);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
