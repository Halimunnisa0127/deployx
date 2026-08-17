const mongoose = require('mongoose');

const artifactSchema = new mongoose.Schema(
  {
    deployment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Deployment',
      required: true,
      index: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    storageProvider: {
      type: String,
      required: true,
      enum: ['local', 's3'], // currently supports local
    },
    storageKey: {
      type: String,
      required: true,
      unique: true, // must be globally unique per artifact
    },
    originalOutputDirectory: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    checksum: {
      type: String,
      required: true, // SHA-256
    },
    fileCount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Artifact', artifactSchema);
