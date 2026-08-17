const mongoose = require('mongoose');

const logSequenceSchema = new mongoose.Schema({
  deployment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deployment',
    required: true,
    unique: true,
  },
  sequence: {
    type: Number,
    default: 0,
  }
});

module.exports = mongoose.model('LogSequence', logSequenceSchema);
