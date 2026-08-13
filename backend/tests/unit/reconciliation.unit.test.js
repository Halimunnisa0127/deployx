process.env.NODE_ENV = 'test';
process.env.PORT = '3000';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
process.env.CLIENT_URL = 'http://localhost:3000';
process.env.JWT_ACCESS_SECRET = 'a'.repeat(64);
process.env.JWT_REFRESH_SECRET = 'b'.repeat(64);
process.env.GITHUB_CLIENT_ID = 'gitclient';
process.env.GITHUB_CLIENT_SECRET = 'gitsecret';
process.env.GITHUB_REDIRECT_URI = 'http://localhost:3000/callback';
process.env.GITHUB_TOKEN_ENCRYPTION_KEY = 'c'.repeat(64);
process.env.GOOGLE_CLIENT_ID = 'googleclient';
process.env.GOOGLE_CLIENT_SECRET = 'googlesecret';
process.env.GOOGLE_REDIRECT_URI = 'http://localhost:3000/callback';
process.env.PROJECT_SECRET_ENCRYPTION_KEY = 'd'.repeat(64);

const envMock = {
  mongoUri: 'mongodb://localhost:27017/test',
  redis: {
    host: 'localhost',
    port: 6379,
    password: null
  },
  timeouts: {
    deploymentQueueTimeoutMs: 600000,
    deploymentBuildTimeoutMs: 900000
  },
  retention: {
    artifactRetentionDays: 30,
    artifactCleanupIntervalMs: 86400000
  }
};

const loggerMock = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
  fatal: jest.fn()
};

const queueMock = {
  getJob: jest.fn()
};

jest.mock('../../src/config/env/env', () => envMock);
jest.mock('../config/env/env', () => envMock, { virtual: true });
jest.mock('../../config/env/env', () => envMock, { virtual: true });

jest.mock('../../src/config/logger/logger', () => loggerMock);
jest.mock('../config/logger/logger', () => loggerMock, { virtual: true });

jest.mock('../../src/infrastructure/queue/deployment.queue', () => queueMock);
jest.mock('../infrastructure/queue/deployment.queue', () => queueMock, { virtual: true });

jest.mock('../../src/modules/deployments/models/Deployment');
jest.mock('../../src/infrastructure/docker/docker.client');
jest.mock('dockerode');

const mongoose = require('mongoose');
const Deployment = require('../../src/modules/deployments/models/Deployment');
const DockerClient = require('../../src/infrastructure/docker/docker.client');
const deploymentQueue = require('../../src/infrastructure/queue/deployment.queue');
const { reconcileStaleDeployments } = require('../../src/workers/reconciliation.worker');

describe('Reconciliation Worker Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Stale queued deployment with no BullMQ job is marked failed', async () => {
    const mockDep = {
      _id: 'dep-stale-queued',
      status: 'queued',
      createdAt: new Date(Date.now() - 1000000)
    };

    // Stale queued lookup returns mockDep
    Deployment.find = jest.fn()
      .mockResolvedValueOnce([mockDep]) // for queued
      .mockResolvedValueOnce([]);      // for building

    deploymentQueue.getJob = jest.fn().mockResolvedValue(null);
    Deployment.findOneAndUpdate = jest.fn().mockResolvedValue(true);

    await reconcileStaleDeployments();

    expect(deploymentQueue.getJob).toHaveBeenCalledWith('deploy-dep-stale-queued');
    expect(Deployment.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: 'dep-stale-queued', status: 'queued' },
      { status: 'failed', errorMessage: expect.stringContaining('timeout') },
      { new: true }
    );
  });

  test('Stale building deployment with no active container is marked failed', async () => {
    const mockDep = {
      _id: 'dep-stale-building',
      status: 'building',
      startedAt: new Date(Date.now() - 1000000)
    };

    Deployment.find = jest.fn()
      .mockResolvedValueOnce([]) // for queued
      .mockResolvedValueOnce([mockDep]); // for building

    // Container exists but not running
    const mockContainer = {
      inspect: jest.fn().mockResolvedValue({ State: { Running: false } })
    };
    DockerClient.findDeploymentContainer = jest.fn().mockResolvedValue(mockContainer);
    DockerClient.removeDeploymentContainer = jest.fn().mockResolvedValue(true);
    Deployment.findOneAndUpdate = jest.fn().mockResolvedValue(true);

    await reconcileStaleDeployments();

    expect(DockerClient.findDeploymentContainer).toHaveBeenCalledWith('dep-stale-building');
    expect(Deployment.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: 'dep-stale-building', status: 'building' },
      { status: 'failed', errorMessage: expect.stringContaining('timeout') },
      { new: true }
    );
    expect(DockerClient.removeDeploymentContainer).toHaveBeenCalledWith('dep-stale-building');
  });

  test('Stale building deployment with active container is allowed to continue running', async () => {
    const mockDep = {
      _id: 'dep-active-building',
      status: 'building',
      startedAt: new Date(Date.now() - 1000000)
    };

    Deployment.find = jest.fn()
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([mockDep]);

    const mockContainer = {
      inspect: jest.fn().mockResolvedValue({ State: { Running: true } })
    };
    DockerClient.findDeploymentContainer = jest.fn().mockResolvedValue(mockContainer);
    Deployment.findOneAndUpdate = jest.fn();

    await reconcileStaleDeployments();

    expect(DockerClient.findDeploymentContainer).toHaveBeenCalledWith('dep-active-building');
    expect(Deployment.findOneAndUpdate).not.toHaveBeenCalled();
  });

  test('Active runtime containers are not removed by reconciliation', async () => {
    const Docker = require('dockerode');
    
    const mockListContainers = jest.fn().mockResolvedValue([
      {
        Id: 'runtime-container-id',
        Labels: {
          deployx: 'true',
          deploymentId: 'dep-ready-id',
          type: 'runtime'
        }
      },
      {
        Id: 'build-container-id',
        Labels: {
          deployx: 'true',
          deploymentId: 'dep-failed-id'
        }
      }
    ]);
    
    const mockRemove = jest.fn().mockResolvedValue(true);
    const mockGetContainer = jest.fn().mockReturnValue({
      remove: mockRemove
    });

    Docker.prototype.listContainers = mockListContainers;
    Docker.prototype.getContainer = mockGetContainer;

    Deployment.find = jest.fn().mockResolvedValue([]);
    Deployment.findOne = jest.fn().mockResolvedValue(null);

    await reconcileStaleDeployments();

    expect(mockGetContainer).toHaveBeenCalledWith('build-container-id');
    expect(mockGetContainer).not.toHaveBeenCalledWith('runtime-container-id');
    expect(mockRemove).toHaveBeenCalledTimes(1);
  });
});
