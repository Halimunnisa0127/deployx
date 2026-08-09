const mongoose = require('mongoose');
const redisConnection = require('../../../infrastructure/queue/redis');
const DockerClient = require('../../../infrastructure/docker/docker.client');
const telemetry = require('../../../shared/utils/telemetry');
const Deployment = require('../../deployments/models/Deployment');
const logger = require('../../../config/logger/logger');

class AdminHealthService {
  /**
   * Checks if Docker daemon is available
   */
  static async isDockerAvailable() {
    return await DockerClient.ping();
  }

  /**
   * Fetches active worker heartbeats from Redis
   */
  static async getActiveWorkers() {
    try {
      const keys = await redisConnection.keys('deployx:worker:heartbeat:*');
      const workers = [];
      for (const key of keys) {
        const val = await redisConnection.get(key);
        if (val) {
          workers.push(JSON.parse(val));
        }
      }
      return workers;
    } catch (err) {
      logger.error({ err: err.message }, 'Failed to get active workers from Redis');
      return [];
    }
  }

  /**
   * Compiles the overview summary
   */
  static async getOverview() {
    const mongoReady = telemetry.isMongoReady();
    const redisReady = telemetry.isRedisReady();
    const dockerReady = await this.isDockerAvailable();

    let queueMetrics = { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 };
    try {
      queueMetrics = await telemetry.getQueueMetrics();
    } catch (err) {
      // Degraded queue handling
    }

    const isHealthy = mongoReady && redisReady && dockerReady;
    let status = 'healthy';
    if (!mongoReady || !redisReady) {
      status = 'unavailable';
    } else if (!dockerReady) {
      status = 'degraded';
    }

    return {
      success: true,
      status,
      services: {
        mongodb: mongoReady ? 'ready' : 'unavailable',
        redis: redisReady ? 'ready' : 'unavailable',
        docker: dockerReady ? 'ready' : 'unavailable'
      },
      queue: {
        waiting: queueMetrics.waiting,
        active: queueMetrics.active,
        completed: queueMetrics.completed,
        failed: queueMetrics.failed,
        delayed: queueMetrics.delayed
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Compiles detailed infrastructure metrics
   */
  static async getInfrastructure() {
    const mongoReady = telemetry.isMongoReady();
    const redisReady = telemetry.isRedisReady();
    const dockerReady = await this.isDockerAvailable();
    const activeWorkers = await this.getActiveWorkers();

    let queueMetrics = { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 };
    try {
      queueMetrics = await telemetry.getQueueMetrics();
    } catch (err) {
      // Ignore queue metric gathering errors for infrastructure metrics resilience
    }

    let deployxContainersCount = 0;
    if (dockerReady) {
      try {
        const Docker = require('dockerode');
        const docker = new Docker();
        const containers = await docker.listContainers({
          all: true,
          filters: JSON.stringify({ label: ['deployx=true'] })
        });
        deployxContainersCount = containers.length;
      } catch (err) {
        // Ignore container listing errors
      }
    }

    const workerStatus = activeWorkers.length > 0 ? 'available' : 'offline';

    // Calculate disk usage safely using fs.promises.statfs
    const fs = require('fs');
    const path = require('path');
    const config = require('../../../config/env/env');
    let diskStats = {
      status: "healthy",
      usedBytes: 0,
      availableBytes: 0,
      usagePercent: 0
    };

    try {
      const baseDir = path.join(process.cwd(), '.artifacts');
      if (fs.promises && fs.promises.statfs) {
        const stats = await fs.promises.statfs(baseDir);
        const total = stats.blocks * stats.bsize;
        const free = stats.bfree * stats.bsize;
        const used = total - free;
        const percent = Number(((used / total) * 100).toFixed(2));

        let status = 'healthy';
        if (percent >= config.retention.diskCriticalPercent) {
          status = 'critical';
        } else if (percent >= config.retention.diskWarningPercent) {
          status = 'warning';
        }

        diskStats = {
          status,
          usedBytes: used,
          availableBytes: free,
          usagePercent: percent
        };
      }
    } catch (diskErr) {
      // Ignore and fallback
    }

    return {
      mongodb: {
        status: mongoReady ? 'ready' : 'unavailable'
      },
      redis: {
        status: redisReady ? 'ready' : 'unavailable'
      },
      queue: queueMetrics,
      worker: {
        status: workerStatus,
        activeWorkersCount: activeWorkers.length,
        workers: activeWorkers.map(w => ({
          workerId: w.workerId,
          status: w.status,
          uptime: w.uptime,
          pid: w.pid,
          lastHeartbeat: w.lastHeartbeat
        }))
      },
      docker: {
        status: dockerReady ? 'ready' : 'unavailable',
        activeBuildsCount: deployxContainersCount
      },
      disk: diskStats
    };
  }

  /**
   * Fetches paginated incidents from existing Deployment records
   */
  static async getIncidents(page = 1, limit = 20) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const query = { status: { $in: ['failed', 'cancelled'] } };

    const total = await Deployment.countDocuments(query);
    const deployments = await Deployment.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('project', 'name slug');

    const incidents = deployments.map(d => ({
      id: d._id,
      category: d.status === 'failed' ? 'deployment.failed' : 'deployment.cancelled',
      deploymentNumber: d.deploymentNumber,
      project: d.project ? { id: d.project._id, name: d.project.name, slug: d.project.slug } : null,
      environment: d.environment,
      triggeredBy: d.triggeredBy,
      errorMessage: d.errorMessage || 'No error details provided',
      timestamp: d.updatedAt
    }));

    return {
      incidents,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    };
  }
}

module.exports = AdminHealthService;
