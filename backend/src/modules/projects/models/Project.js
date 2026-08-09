const mongoose = require('mongoose');

const envVarSchema = new mongoose.Schema({
  key: { type: String, required: true, trim: true },
  value: { type: String, required: true },
  isEncrypted: { type: Boolean, default: false },
  iv: { type: String },
  authTag: { type: String },
  environments: [{ type: String, enum: ['Production', 'Preview', 'Development'], default: ['Production', 'Preview', 'Development'] }]
});

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [2, 'Project name must be at least 2 characters'],
      maxlength: [50, 'Project name cannot exceed 50 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    domainUrl: {
      type: String,
      required: true,
    },
    gitRepository: {
      url: { type: String, default: '' },
      fullName: { type: String, default: '' },
      branch: { type: String, default: 'main' },
      provider: { type: String, enum: ['github', 'gitlab', 'bitbucket', 'manual'], default: 'github' },
    },
    framework: {
      type: String,
      default: 'auto',
    },
    rootDirectory: {
      type: String,
      default: '/',
    },
    region: {
      type: String,
      default: 'auto',
    },
    buildSettings: {
      packageManager: { type: String, default: 'npm' },
      installCommand: { type: String, default: 'npm install' },
      buildCommand: { type: String, default: 'npm run build' },
      outputDirectory: { type: String, default: 'dist' },
      nodeVersion: { type: String, default: '20.x' },
    },
    environmentVariables: [envVarSchema],
    productionDeployment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Deployment',
      default: null,
    },
    status: {
      type: String,
      enum: ['draft', 'building', 'live', 'failed'],
      default: 'draft',
    },
    stepCompleted: {
      type: Number,
      default: 1,
      min: 1,
      max: 6,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index on owner and name for quick lookup
projectSchema.index({ owner: 1, name: 1 });

module.exports = mongoose.model('Project', projectSchema);
