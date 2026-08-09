const mongoose = require('mongoose');

const deploymentPromotionHistorySchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    deployment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Deployment',
      required: true,
    },
    previousDeployment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Deployment',
      default: null,
    },
    action: {
      type: String,
      enum: ['promote', 'rollback'],
      required: true,
    },
    triggeredBy: {
      type: String,
      enum: ['manual', 'webhook', 'rollback', 'system'],
      required: true,
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

// Compound index on project + createdAt for paginated retrieval
deploymentPromotionHistorySchema.index({ project: 1, createdAt: -1 });

module.exports = mongoose.model('DeploymentPromotionHistory', deploymentPromotionHistorySchema);
