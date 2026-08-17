const mongoose = require('mongoose');

const deploymentLogSchema = new mongoose.Schema({
  deployment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deployment',
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  level: {
    type: String,
    enum: ['info', 'warning', 'error', 'success'],
    default: 'info',
  },
  message: {
    type: String,
    required: true,
  },
  sequence: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: false });

deploymentLogSchema.index({ deployment: 1, sequence: 1 }, { unique: true });
deploymentLogSchema.index({ project: 1, timestamp: 1 });

module.exports = mongoose.model('DeploymentLog', deploymentLogSchema);
