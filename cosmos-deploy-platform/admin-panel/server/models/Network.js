const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NetworkSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  chainId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['planned', 'deploying', 'active', 'error', 'stopped', 'terminated'],
    default: 'planned'
  },
  deploymentType: {
    type: String,
    enum: ['local', 'testnet', 'mainnet', 'private'],
    default: 'testnet'
  },
  nodeCount: {
    type: Number,
    default: 1,
    min: 1
  },
  validators: [{
    name: String,
    power: Number,
    address: String,
    pubKey: String,
    status: {
      type: String,
      enum: ['active', 'inactive', 'jailed'],
      default: 'active'
    }
  }],
  modules: [{
    name: String,
    enabled: Boolean,
    version: String,
    config: Schema.Types.Mixed
  }],
  tokenomics: {
    denom: String,
    symbol: String,
    display: String,
    initialSupply: Number,
    maxSupply: Number
  },
  governance: {
    votingPeriod: Number,
    minDeposit: Number,
    quorum: Number,
    threshold: Number
  },
  deployment: {
    provider: {
      type: String,
      enum: ['aws', 'gcp', 'azure', 'digitalocean', 'local'],
      default: 'local'
    },
    region: String,
    resources: {
      cpu: Number,
      memory: Number,
      storage: Number
    },
    endpoints: {
      rpc: String,
      api: String,
      explorer: String
    },
    kubernetesConfig: Schema.Types.Mixed,
    dockerConfig: Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  deployedAt: {
    type: Date,
    default: null
  },
  lastActiveAt: {
    type: Date,
    default: null
  }
});

// Update timestamp on document update
NetworkSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Network', NetworkSchema);