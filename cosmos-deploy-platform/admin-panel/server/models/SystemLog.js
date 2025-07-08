const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SystemLogSchema = new Schema({
  level: {
    type: String,
    enum: ['info', 'warning', 'error', 'critical'],
    default: 'info'
  },
  source: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  details: {
    type: Schema.Types.Mixed,
    default: null
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  networkId: {
    type: Schema.Types.ObjectId,
    ref: 'Network',
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  resolved: {
    type: Boolean,
    default: false
  },
  resolvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  resolvedAt: {
    type: Date,
    default: null
  },
  actions: [{
    action: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    result: Schema.Types.Mixed
  }]
});

module.exports = mongoose.model('SystemLog', SystemLogSchema);