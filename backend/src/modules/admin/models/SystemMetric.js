const mongoose = require('mongoose');

const systemMetricSchema = new mongoose.Schema(
  {
    metric: {
      type: String,
      required: true,
      enum: ['cpu', 'memory', 'disk', 'network', 'queue', 'redis', 'mongodb', 'connections', 'requests'],
      index: true,
    },
    value: {
      type: Number,
      required: true,
    },
    host: {
      type: String,
      default: () => {
        try {
          return require('os').hostname();
        } catch {
          return 'deployx-host';
        }
      },
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

// Compound index for querying specific metrics over time range
systemMetricSchema.index({ metric: 1, timestamp: -1 });

// TTL index for automatic retention (expire after 30 days = 2592000 seconds)
systemMetricSchema.index({ timestamp: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

module.exports = mongoose.model('SystemMetric', systemMetricSchema);
