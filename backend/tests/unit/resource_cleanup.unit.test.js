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

jest.mock('../../src/config/env/env', () => envMock);
jest.mock('../config/env/env', () => envMock, { virtual: true });
jest.mock('../../config/env/env', () => envMock, { virtual: true });

jest.mock('../../src/config/logger/logger', () => loggerMock);
jest.mock('../config/logger/logger', () => loggerMock, { virtual: true });

jest.mock('../../src/modules/storage/models/Artifact');
jest.mock('../../src/modules/deployments/models/Deployment');
jest.mock('../../src/modules/projects/models/Project');
jest.mock('../../src/modules/domains/models/Domain');
jest.mock('../../src/modules/storage/providers/LocalArtifactStorageProvider');
jest.mock('dockerode');

const Artifact = require('../../src/modules/storage/models/Artifact');
const Deployment = require('../../src/modules/deployments/models/Deployment');
const Project = require('../../src/modules/projects/models/Project');
const Domain = require('../../src/modules/domains/models/Domain');
const LocalArtifactStorageProvider = require('../../src/modules/storage/providers/LocalArtifactStorageProvider');
const { runCleanup } = require('../../src/workers/resource.cleanup.worker');

describe('Resource Cleanup Worker Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Referenced production or domain-targeted artifacts are retained', async () => {
    const activeProjectId = 'active-proj-dep';
    const activeDomainId = 'active-dom-dep';

    Project.find = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue([{ productionDeployment: activeProjectId }])
    });
    Domain.find = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue([{ targetDeployment: activeDomainId }])
    });

    const mockArtifact1 = {
      _id: 'art-prod',
      deployment: activeProjectId,
      createdAt: new Date(Date.now() - 1000000000),
      storageKey: 'key1'
    };

    const mockArtifact2 = {
      _id: 'art-domain',
      deployment: activeDomainId,
      createdAt: new Date(Date.now() - 1000000000),
      storageKey: 'key2'
    };

    Artifact.find = jest.fn().mockResolvedValue([mockArtifact1, mockArtifact2]);
    Deployment.findById = jest.fn()
      .mockResolvedValueOnce({ _id: activeProjectId, status: 'ready' })
      .mockResolvedValueOnce({ _id: activeDomainId, status: 'ready' });

    const existsSpy = jest.fn();
    const deleteSpy = jest.fn();
    LocalArtifactStorageProvider.prototype.exists = existsSpy;
    LocalArtifactStorageProvider.prototype.delete = deleteSpy;

    await runCleanup();

    expect(existsSpy).not.toHaveBeenCalled();
    expect(deleteSpy).not.toHaveBeenCalled();
    expect(Artifact.findByIdAndDelete).not.toHaveBeenCalled();
  });

  test('Orphaned or terminal state artifacts are successfully deleted from storage and DB', async () => {
    Project.find = jest.fn().mockReturnValue({ select: jest.fn().mockResolvedValue([]) });
    Domain.find = jest.fn().mockReturnValue({ select: jest.fn().mockResolvedValue([]) });

    const mockArtifact = {
      _id: 'art-terminal',
      deployment: 'dep-term',
      createdAt: new Date(),
      storageKey: 'key-term'
    };

    Artifact.find = jest.fn().mockResolvedValue([mockArtifact]);
    Deployment.findById = jest.fn().mockResolvedValue({ _id: 'dep-term', status: 'failed' });
    Deployment.findOne = jest.fn().mockResolvedValue({ _id: 'dep-term' });

    // Mock storage provider: exists = true initially, then exists = false after delete
    const existsSpy = jest.fn()
      .mockResolvedValueOnce(true)   // initially exists
      .mockResolvedValueOnce(false);  // verifyDeleted checks exists
    const deleteSpy = jest.fn().mockResolvedValue(true);

    LocalArtifactStorageProvider.prototype.exists = existsSpy;
    LocalArtifactStorageProvider.prototype.delete = deleteSpy;

    Artifact.findByIdAndDelete = jest.fn().mockResolvedValue(true);
    Deployment.findByIdAndUpdate = jest.fn().mockResolvedValue(true);

    await runCleanup();

    expect(deleteSpy).toHaveBeenCalledWith('key-term');
    expect(Artifact.findByIdAndDelete).toHaveBeenCalledWith('art-terminal');
    expect(Deployment.findByIdAndUpdate).toHaveBeenCalledWith('dep-term', { $unset: { artifact: '' } });
  });

  test('Failed storage deletion retains DB metadata', async () => {
    Project.find = jest.fn().mockReturnValue({ select: jest.fn().mockResolvedValue([]) });
    Domain.find = jest.fn().mockReturnValue({ select: jest.fn().mockResolvedValue([]) });

    const mockArtifact = {
      _id: 'art-fail-delete',
      deployment: 'dep-term',
      createdAt: new Date(),
      storageKey: 'key-fail'
    };

    Artifact.find = jest.fn().mockResolvedValue([mockArtifact]);
    Deployment.findById = jest.fn().mockResolvedValue({ _id: 'dep-term', status: 'cancelled' });
    Deployment.findOne = jest.fn().mockResolvedValue({ _id: 'dep-term' });

    // Mock storage provider: exists = true initially, and STILL exists after deletion attempt
    const existsSpy = jest.fn()
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true);
    const deleteSpy = jest.fn().mockRejectedValue(new Error('Permission Denied'));

    LocalArtifactStorageProvider.prototype.exists = existsSpy;
    LocalArtifactStorageProvider.prototype.delete = deleteSpy;

    Artifact.findByIdAndDelete = jest.fn();

    await runCleanup();

    expect(Artifact.findByIdAndDelete).not.toHaveBeenCalled();
  });

  test('Active runtime containers are not removed by resource cleanup', async () => {
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

    Artifact.find = jest.fn().mockResolvedValue([]);
    Project.find = jest.fn().mockReturnValue({ select: jest.fn().mockResolvedValue([]) });
    Domain.find = jest.fn().mockReturnValue({ select: jest.fn().mockResolvedValue([]) });
    Deployment.findOne = jest.fn().mockResolvedValue(null);

    await runCleanup();

    expect(mockGetContainer).toHaveBeenCalledWith('build-container-id');
    expect(mockGetContainer).not.toHaveBeenCalledWith('runtime-container-id');
    expect(mockRemove).toHaveBeenCalledTimes(1);
  });
});
