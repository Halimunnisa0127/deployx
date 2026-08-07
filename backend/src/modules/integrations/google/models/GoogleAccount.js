const mongoose = require('mongoose');
const { PROVIDERS } = require('../constants/google.constants');

const googleAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    provider: {
      type: String,
      default: 'google', // Hardcode or use PROVIDERS.GOOGLE later
    },
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
    },
    avatar: {
      type: String,
    },
    connectedAt: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    refreshToken: {
      type: String,
      select: false, // Keep it hidden by default
    },
    tokenExpiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('GoogleAccount', googleAccountSchema);
