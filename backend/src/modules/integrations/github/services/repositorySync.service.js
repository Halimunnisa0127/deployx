const GitHubRepository = require('../models/GitHubRepository');
const GitHubAccount = require('../models/GitHubAccount');
const githubRepositoryService = require('./githubRepository.service');
const QueryBuilder = require('../../../../utils/helpers/QueryBuilder');
const { GITHUB_SYNC_STATUS } = require('../../shared/enums/githubSyncStatus.enum');
const ApiError = require('../../../../shared/errors/ApiError');
const GitHubClient = require('../../../../infrastructure/github/github.client');
const { decrypt } = require('../../../../utils/helpers/encryption.helper');

/**
 * Perform a full synchronization of the user's repositories from GitHub
 */
exports.syncRepositories = async (userId) => {
  const account = await GitHubAccount.findOne({ userId });
  if (!account) {
    throw new ApiError(404, 'GitHub account not connected');
  }

  // Update status to syncing
  account.syncStatus = GITHUB_SYNC_STATUS.SYNCING;
  await account.save();

  const syncStartTime = Date.now();

  try {
    // We fetch all repositories. In a real app, this should handle pagination properly across all pages.
    // For this implementation, we will fetch up to 100 repositories.
    const repos = await githubRepositoryService.getRepositories(userId, { per_page: 100 });

    const githubRepoIds = [];

    // Bulk upsert operations
    const bulkOps = repos.map((repo) => {
      githubRepoIds.push(repo.id);

      return {
        updateOne: {
          filter: { userId, githubRepositoryId: repo.id },
          update: {
            $set: {
              name: repo.name,
              fullName: repo.fullName,
              owner: repo.owner,
              visibility: repo.visibility,
              defaultBranch: repo.defaultBranch,
              language: repo.language,
              description: repo.description,
              cloneUrl: repo.cloneUrl,
              sshUrl: repo.sshUrl,
              isPrivate: repo.isPrivate,
              isArchived: repo.isArchived,
              isFork: repo.isFork,
              pushedAt: repo.pushedAt,
              updatedAt: repo.updatedAt,
              lastSyncedAt: new Date(),
            },
          },
          upsert: true,
        },
      };
    });

    if (bulkOps.length > 0) {
      await GitHubRepository.bulkWrite(bulkOps);
    }

    // Remove stale repositories that were not in this sync
    await GitHubRepository.deleteMany({
      userId,
      githubRepositoryId: { $nin: githubRepoIds },
    });

    const syncDuration = Date.now() - syncStartTime;

    // Update account with success
    account.syncStatus = GITHUB_SYNC_STATUS.SUCCESS;
    account.lastSyncedAt = new Date();
    // Save metadata if we extended account to store sync durations
    await account.save();

    return { message: 'Synchronization completed successfully', syncedCount: githubRepoIds.length };
  } catch (error) {
    account.syncStatus = GITHUB_SYNC_STATUS.FAILED;
    await account.save();
    throw error; // Let the global error handler catch it or rethrow
  }
};

/**
 * Retrieve repositories from the database using QueryBuilder
 */
exports.getRepositories = async (userId, query) => {
  // Enforce querying only for the given user
  const mongooseQuery = GitHubRepository.find({ userId });
  
  // Create a QueryBuilder instance
  const builder = new QueryBuilder(mongooseQuery, query);
  
  // Apply filtering (search, language, visibility, owner), sorting, pagination
  builder
    .filter(['name', 'fullName', 'description']) // Regex search fields
    .sort()
    .project(); // Assuming project is default

  const result = await builder.execute();
  return result;
};

/**
 * Synchronize a single repository
 */
exports.syncRepository = async (userId, repositoryId) => {
  const account = await GitHubAccount.findOne({ userId });
  if (!account) {
    throw new ApiError(404, 'GitHub account not connected');
  }

  const accessToken = decrypt(account.encryptedAccessToken);
  const client = new GitHubClient(accessToken);
  
  try {
    // Assuming repositoryId is the internal string ID from github
    // First, find the repo to get owner and repo name
    const repoRecord = await GitHubRepository.findOne({ userId, githubRepositoryId: repositoryId });
    if (!repoRecord) {
      throw new ApiError(404, 'Repository not found in local database');
    }

    const rawRepo = await client.get(`/repos/${repoRecord.owner}/${repoRecord.name}`);
    
    repoRecord.name = rawRepo.name;
    repoRecord.fullName = rawRepo.full_name;
    repoRecord.visibility = rawRepo.visibility || (rawRepo.private ? 'private' : 'public');
    repoRecord.defaultBranch = rawRepo.default_branch;
    repoRecord.language = rawRepo.language;
    repoRecord.description = rawRepo.description;
    repoRecord.cloneUrl = rawRepo.clone_url;
    repoRecord.sshUrl = rawRepo.ssh_url;
    repoRecord.isPrivate = rawRepo.private;
    repoRecord.isArchived = rawRepo.archived;
    repoRecord.isFork = rawRepo.fork;
    repoRecord.pushedAt = rawRepo.pushed_at;
    repoRecord.updatedAt = rawRepo.updated_at;
    repoRecord.lastSyncedAt = new Date();

    await repoRecord.save();
    
    return repoRecord;
  } catch (error) {
    if (error.status === 404) {
      // Repository deleted or renamed heavily
      await GitHubRepository.findOneAndDelete({ userId, githubRepositoryId: repositoryId });
      throw new ApiError(404, 'Repository no longer exists on GitHub, removed from database');
    }
    throw error;
  }
};

/**
 * Retrieve a single synced repository
 */
exports.getRepository = async (userId, repositoryId) => {
  const repo = await GitHubRepository.findOne({ userId, githubRepositoryId: repositoryId });
  if (!repo) {
    throw new ApiError(404, 'Repository not found');
  }
  return repo;
};

/**
 * Stubs for scheduled synchronization
 */
exports.scheduleRepositorySync = async (userId, cronExpression) => {
  // TODO: Implement cron job scheduling
  return { message: 'Sync scheduled' };
};

exports.cancelRepositorySync = async (userId) => {
  // TODO: Implement cron job cancellation
  return { message: 'Sync cancelled' };
};

exports.getSyncStatus = async (userId) => {
  const account = await GitHubAccount.findOne({ userId });
  if (!account) {
    throw new ApiError(404, 'GitHub account not connected');
  }
  return { 
    status: account.syncStatus || GITHUB_SYNC_STATUS.PENDING,
    lastSyncedAt: account.lastSyncedAt,
    username: account.username,
  };
};
