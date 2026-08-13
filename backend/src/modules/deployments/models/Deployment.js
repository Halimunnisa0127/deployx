const mongoose = require('mongoose');

const deploymentSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    deploymentNumber: {
      type: Number,
      required: true,
    },
    environment: {
      type: String,
      enum: ['Production', 'Preview', 'Development'],
      required: true,
    },
    branch: {
      type: String,
      required: true,
      default: 'main',
    },
    commitHash: {
      type: String,
      default: null,
    },
    commitMessage: {
      type: String,
      default: null,
    },
    buildSettings: {
      framework: { type: String, default: 'auto' },
      packageManager: { type: String, default: 'npm' },
      installCommand: { type: String, default: 'npm install' },
      buildCommand: { type: String, default: 'npm run build' },
      outputDirectory: { type: String, default: 'dist' },
      nodeVersion: { type: String, default: '20.x' },
      rootDirectory: { type: String, default: '/' },
    },
    source: {
      provider: { type: String, enum: ['github', 'gitlab', 'bitbucket', 'manual'], default: 'github' },
      repositoryFullName: { type: String, default: null },
      branch: { type: String, default: 'main' },
      commitSha: { type: String, default: null },
      commitMessage: { type: String, default: null },
    },
    region: {
      type: String,
      default: 'auto',
    },
    status: {
      type: String,
      enum: ['queued', 'building', 'ready', 'failed', 'cancelled'],
      default: 'queued',
      index: true,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    triggeredBy: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      default: null,
    },
    errorMessage: {
      type: String,
      default: null,
    },
    artifact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artifact',
      default: null,
    },
    runtimeContainerId: {
      type: String,
      default: null,
    },
    runtimePort: {
      type: Number,
      default: null,
    }
  },
  {
    timestamps: true,
  }
);

// Compound index to quickly find a specific deployment number for a project
deploymentSchema.index({ project: 1, deploymentNumber: 1 }, { unique: true });
// Compound index for listing a user's project deployments
deploymentSchema.index({ owner: 1, project: 1 });
// Index for sorting by creation date
deploymentSchema.index({ createdAt: -1 });
// Compound index to query/deduplicate deployments by project repository source commit
deploymentSchema.index({ project: 1, 'source.branch': 1, 'source.commitSha': 1 });

module.exports = mongoose.model('Deployment', deploymentSchema);
