const mongoose = require('mongoose');

const gitHubRepositorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    githubRepositoryId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    visibility: {
      type: String,
      enum: ['public', 'private', 'internal'],
      default: 'public',
    },
    defaultBranch: {
      type: String,
      default: 'main',
    },
    language: {
      type: String,
    },
    description: {
      type: String,
    },
    cloneUrl: {
      type: String,
      required: true,
    },
    sshUrl: {
      type: String,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    isFork: {
      type: Boolean,
      default: false,
    },
    pushedAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
    lastSyncedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound index to ensure one record per user per repo
gitHubRepositorySchema.index({ userId: 1, githubRepositoryId: 1 }, { unique: true });
// Indexes for querying
gitHubRepositorySchema.index({ visibility: 1 });
gitHubRepositorySchema.index({ language: 1 });

module.exports = mongoose.model('GitHubRepository', gitHubRepositorySchema);
