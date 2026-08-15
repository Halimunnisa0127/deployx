const mongoose = require('mongoose');

const deploymentCounterSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    unique: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('DeploymentCounter', deploymentCounterSchema);
