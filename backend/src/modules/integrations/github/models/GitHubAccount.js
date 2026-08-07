const mongoose = require('mongoose');
const { PROVIDERS, PROVIDER_TYPES } = require('../constants/github.constants');
const { GITHUB_SYNC_STATUS } = require('../../shared/enums/githubSyncStatus.enum');

const gitHubAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
      unique: true, // Assuming one GitHub account per user for now
    },
    provider: {
      type: String,
      default: PROVIDERS.GITHUB,
      required: true,
    },
    providerType: {
      type: String,
      default: PROVIDER_TYPES.OAUTH,
      required: true,
    },
    githubId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
    },
    encryptedAccessToken: {
      encryptedData: { type: String, required: true },
      iv: { type: String, required: true },
      authTag: { type: String, required: true },
      version: { type: Number, required: true },
    },
    installationId: {
      type: String,
      default: null,
    },
    connectedAt: {
      type: Date,
      default: Date.now,
    },
    refreshToken: {
      type: String,
    },
    tokenExpiresAt: {
      type: Date,
    },
    lastTokenRefreshAt: {
      type: Date,
    },
    lastSyncedAt: {
      type: Date,
    },
    syncStatus: {
      type: String,
      enum: Object.values(GITHUB_SYNC_STATUS),
    },
    metadata: {
      accountType: String,
      installationTarget: String,
      organizationName: String,
    },
  },
  { timestamps: true }
);

// Indexes for future synchronization and lookups
gitHubAccountSchema.index({ provider: 1, providerType: 1 });
gitHubAccountSchema.index({ lastSyncedAt: 1 });
gitHubAccountSchema.index({ syncStatus: 1 });

module.exports = mongoose.model('GitHubAccount', gitHubAccountSchema);
