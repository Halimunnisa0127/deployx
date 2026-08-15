const mongoose = require('mongoose');

const domainSchema = new mongoose.Schema(
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
    hostname: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    verificationToken: {
      type: String,
      required: true,
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'failed'],
      default: 'pending',
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'disabled'],
      default: 'pending',
    },
    targetType: {
      type: String,
      enum: ['production', 'deployment'],
      default: 'production',
    },
    targetDeployment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Deployment',
      default: null,
    },
    sslStatus: {
      type: String,
      enum: ['not_configured', 'pending', 'active', 'failed'],
      default: 'not_configured',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Domain', domainSchema);
