const mongoose = require('mongoose');

const githubWebhookDeliverySchema = new mongoose.Schema({
  deliveryId: {
    type: String,
    required: true,
    unique: true
  },
  event: {
    type: String,
    required: true
  },
  repository: {
    type: String,
    required: true
  },
  deployment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deployment',
    default: null
  },
  processedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('GithubWebhookDelivery', githubWebhookDeliverySchema);
