require('dotenv').config();
const mongoose = require('mongoose');
const os = require('os');
const crypto = require('crypto');
const config = require('../config/env/env');
const logger = require('../config/logger/logger');
const Artifact = require('../modules/storage/models/Artifact');
const Deployment = require('../modules/deployments/models/Deployment');
const Project = require('../modules/projects/models/Project');
const Domain = require('../modules/domains/models/Domain');
const LocalArtifactStorageProvider = require('../modules/storage/providers/LocalArtifactStorageProvider');
const Docker = require('dockerode');

const workerId = `cleaner-${os.hostname()}-${process.pid}-${crypto.randomBytes(4).toString('hex')}`;
const storageProvider = new LocalArtifactStorageProvider();
const docker = new Docker();

// Connect to MongoDB
mongoose.connect(config.mongoUri)
  .then(() => {
    logger.info({ event: 'cleaner.started', workerId }, '[Cleaner] Connected to MongoDB');
    startCleanupLoop();
  })
  .catch((err) => {
    logger.fatal({ event: 'cleaner.error', workerId, err: err.message }, '[Cleaner] MongoDB connection error');
    process.exit(1);
  });

let intervalId;

async function runCleanup() {
  logger.info({ event: 'cleaner.tick', workerId }, '[Cleaner] Starting resource cleanup cycle...');

  try {
    // 1. Scan for all Artifact documents
    const artifacts = await Artifact.find({});
    
    // Find all active production/domain target deployments to retain
    const activeProjects = await Project.find({ productionDeployment: { $ne: null } }).select('productionDeployment');
    const activeDomains = await Domain.find({ targetDeployment: { $ne: null } }).select('targetDeployment');

    const retainedDeploymentIds = new Set([
      ...activeProjects.map(p => p.productionDeployment.toString()),
      ...activeDomains.map(d => d.targetDeployment.toString())
    ]);

    const retentionDays = config.retention.artifactRetentionDays;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    for (const art of artifacts) {
      try {
        let shouldDelete = false;
        let reason = '';

        // Check if deployment exists
        const dep = await Deployment.findById(art.deployment);
        if (!dep) {
          shouldDelete = true;
          reason = 'Orphaned (Deployment document missing)';
        } else {
          const isReferencedInTargets = retainedDeploymentIds.has(dep._id.toString());
          
          if (isReferencedInTargets) {
            // Must always retain active targets regardless of age
            continue;
          }

          const isOlderThanRetention = art.createdAt < cutoffDate;
          const isTerminalState = ['failed', 'cancelled'].includes(dep.status);

          if (isTerminalState) {
            shouldDelete = true;
            reason = `Deployment terminal state (${dep.status})`;
          } else if (isOlderThanRetention) {
            shouldDelete = true;
            reason = `Exceeded retention policy of ${retentionDays} days`;
          }
        }

        if (shouldDelete) {
          logger.info({ artifactId: art._id, storageKey: art.storageKey, reason }, '[Cleaner] Deleting safe artifact candidate');
          
          // Verify no active deployment references it (concurrency safety check)
          const doubleCheckDep = await Deployment.findOne({ artifact: art._id });
          if (doubleCheckDep && retainedDeploymentIds.has(doubleCheckDep._id.toString())) {
            logger.warn({ artifactId: art._id }, '[Cleaner] Candidate was promoted or targeted concurrently. Skipping.');
            continue;
          }

          // Step 1: Delete storage file
          const fileExists = await storageProvider.exists(art.storageKey);
          if (fileExists) {
            await storageProvider.delete(art.storageKey);
          }

          // Step 2: Delete metadata ONLY if storage deletion succeeds
          const verifyDeleted = await storageProvider.exists(art.storageKey);
          if (!verifyDeleted) {
            await Artifact.findByIdAndDelete(art._id);
            if (dep) {
              await Deployment.findByIdAndUpdate(dep._id, { $unset: { artifact: '' } });
            }
            logger.info({ artifactId: art._id }, '[Cleaner] Successfully deleted artifact metadata.');
          } else {
            logger.error({ artifactId: art._id }, '[Cleaner] Failed to delete artifact file. Retaining DB metadata.');
          }
        }
      } catch (artErr) {
        logger.error({ artifactId: art._id, err: artErr.message }, '[Cleaner] Error cleaning up artifact');
      }
    }

    // 2. Clean abandoned DeployX-owned Docker containers
    try {
      const containers = await docker.listContainers({
        all: true,
        filters: JSON.stringify({ label: ['deployx=true'] })
      });

      for (const cInfo of containers) {
        const depId = cInfo.Labels.deploymentId;
        if (depId) {
          const activeDep = await Deployment.findOne({ _id: depId, status: 'building' });
          if (!activeDep) {
            logger.warn({ deploymentId: depId, containerId: cInfo.Id }, '[Cleaner] Found abandoned deployx container. Pruning.');
            try {
              const container = docker.getContainer(cInfo.Id);
              await container.remove({ force: true });
            } catch (cErr) {
              // ignore
            }
          }
        }
      }
    } catch (dockerErr) {
      logger.error({ err: dockerErr.message }, '[Cleaner] Failed to list/clean DeployX containers');
    }

  } catch (error) {
    logger.error({ err: error.message }, '[Cleaner] Error during cleanup tick');
  }
}

function startCleanupLoop() {
  runCleanup();
  intervalId = setInterval(runCleanup, config.retention.artifactCleanupIntervalMs);
}

// Graceful Shutdown
const shutdown = async (signal) => {
  logger.info({ event: 'cleaner.shutdown', workerId }, `[Cleaner] Received ${signal}. Shutting down gracefully...`);
  if (intervalId) clearInterval(intervalId);
  try {
    await mongoose.disconnect();
    logger.info({ event: 'cleaner.shutdown', workerId }, '[Cleaner] MongoDB connection closed.');
    process.exit(0);
  } catch (err) {
    logger.error({ event: 'cleaner.error', workerId, err: err.message }, '[Cleaner] Error during shutdown');
    process.exit(1);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
