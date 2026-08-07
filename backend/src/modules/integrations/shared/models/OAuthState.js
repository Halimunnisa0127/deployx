const mongoose = require('mongoose');

const oauthStateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      index: true,
    },
    provider: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('OAuthState', oauthStateSchema);
