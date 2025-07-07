/**
 * Network Model
 * 
 * Defines the schema for blockchain networks in the system.
 */

const mongoose = require('mongoose');

/**
 * Token Economics Schema
 */
const TokenEconomicsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Token name is required'],
    trim: true
  },
  symbol: {
    type: String,
    required: [true, 'Token symbol is required'],
    trim: true,
    uppercase: true,
    maxlength: [12, 'Symbol cannot be more than 12 characters']
  },
  decimals: {
    type: Number,
    required: [true, 'Token decimals is required'],
    min: [0, 'Decimals must be a positive number'],
    max: [18, 'Decimals cannot exceed 18'],
    default: 6
  },
  initialSupply: {
    type: Number,
    required: [true, 'Initial supply is required'],
    min: [1, 'Initial supply must be at least 1']
  },
  maxSupply: {
    type: Number,
    default: null
  },
  distribution: {
    validators: {
      type: Number,
      required: [true, 'Validator distribution percentage is required'],
      min: [0, 'Percentage must be between 0 and 100'],
      max: [100, 'Percentage must be between 0 and 100']
    },
    community: {
      type: Number,
      required: [true, 'Community distribution percentage is required'],
      min: [0, 'Percentage must be between 0 and 100'],
      max: [100, 'Percentage must be between 0 and 100']
    },
    foundation: {
      type: Number,
      required: [true, 'Foundation distribution percentage is required'],
      min: [0, 'Percentage must be between 0 and 100'],
      max: [100, 'Percentage must be between 0 and 100']
    },
    airdrop: {
      type: Number,
      required: [true, 'Airdrop distribution percentage is required'],
      min: [0, 'Percentage must be between 0 and 100'],
      max: [100, 'Percentage must be between 0 and 100']
    }
  }
});

/**
 * Validator Requirements Schema
 */
const ValidatorRequirementsSchema = new mongoose.Schema({
  minStake: {
    type: Number,
    required: [true, 'Minimum stake is required'],
    min: [0, 'Minimum stake cannot be negative']
  },
  maxValidators: {
    type: Number,
    default: null
  },
  unbondingPeriod: {
    type: Number,
    required: [true, 'Unbonding period is required'],
    min: [1, 'Unbonding period must be at least 1 day'],
    default: 21
  }
});

/**
 * Governance Settings Schema
 */
const GovernanceSettingsSchema = new mongoose.Schema({
  votingPeriod: {
    type: Number,
    required: [true, 'Voting period is required'],
    min: [1, 'Voting period must be at least 1 day'],
    default: 14
  },
  quorum: {
    type: Number,
    required: [true, 'Quorum percentage is required'],
    min: [0, 'Percentage must be between 0 and 100'],
    max: [100, 'Percentage must be between 0 and 100'],
    default: 33.4
  },
  threshold: {
    type: Number,
    required: [true, 'Threshold percentage is required'],
    min: [0, 'Percentage must be between 0 and 100'],
    max: [100, 'Percentage must be between 0 and 100'],
    default: 50
  },
  vetoThreshold: {
    type: Number,
    required: [true, 'Veto threshold percentage is required'],
    min: [0, 'Percentage must be between 0 and 100'],
    max: [100, 'Percentage must be between 0 and 100'],
    default: 33.4
  }
});

/**
 * Module Schema
 */
const ModuleSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'Module ID is required'],
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Module name is required'],
    trim: true
  },
  enabled: {
    type: Boolean,
    default: true
  },
  config: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

/**
 * Network Metrics Schema
 */
const NetworkMetricsSchema = new mongoose.Schema({
  blockHeight: {
    type: Number,
    default: 0
  },
  blockTime: {
    type: Number,
    default: 0
  },
  activeValidators: {
    type: Number,
    default: 0
  },
  totalStaked: {
    type: Number,
    default: 0
  },
  transactions: {
    total: {
      type: Number,
      default: 0
    },
    perSecond: {
      type: Number,
      default: 0
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Validator Schema
 */
const ValidatorSchema = new mongoose.Schema({
  address: {
    type: String,
    required: [true, 'Validator address is required'],
    trim: true
  },
  moniker: {
    type: String,
    required: [true, 'Validator moniker is required'],
    trim: true
  },
  identity: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  details: {
    type: String,
    default: ''
  },
  commission: {
    type: Number,
    required: [true, 'Commission percentage is required'],
    min: [0, 'Percentage must be between 0 and 100'],
    max: [100, 'Percentage must be between 0 and 100']
  },
  uptime: {
    type: Number,
    default: 100
  },
  stake: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Active', 'Jailed', 'Tombstoned'],
    default: 'Active'
  }
});

/**
 * Backup Schema
 */
const BackupSchema = new mongoose.Schema({
  backupId: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  size: {
    type: Number,
    default: 0
  },
  location: {
    type: String,
    required: true
  },
  blockHeight: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Deployment Schema
 */
const DeploymentSchema = new mongoose.Schema({
  environment: {
    type: String,
    required: [true, 'Deployment environment is required'],
    enum: ['local', 'testnet', 'mainnet', 'aws', 'gcp', 'azure', 'custom']
  },
  status: {
    type: String,
    enum: ['Queued', 'Deploying', 'Active', 'Failed', 'Terminating', 'Terminated'],
    default: 'Queued'
  },
  resources: {
    cpu: {
      type: Number,
      default: 2
    },
    memory: {
      type: Number,
      default: 4
    },
    storage: {
      type: Number,
      default: 100
    },
    nodes: {
      type: Number,
      default: 1
    }
  },
  endpoints: {
    rpc: String,
    rest: String,
    p2p: String,
    explorer: String,
    metrics: String
  },
  infraDetails: {
    provider: String,
    region: String,
    instanceType: String,
    kubernetesCluster: String,
    terraformState: String
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  logs: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    message: String,
    level: {
      type: String,
      enum: ['info', 'warning', 'error'],
      default: 'info'
    }
  }]
});

/**
 * Network Schema
 */
const NetworkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Network name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  chainId: {
    type: String,
    required: [true, 'Chain ID is required'],
    trim: true,
    unique: true,
    match: [
      /^[a-zA-Z0-9_-]+$/,
      'Chain ID can only contain alphanumeric characters, underscores, and hyphens'
    ]
  },
  description: {
    type: String,
    default: ''
  },
  tokenEconomics: {
    type: TokenEconomicsSchema,
    required: [true, 'Token economics is required']
  },
  validatorRequirements: {
    type: ValidatorRequirementsSchema,
    required: [true, 'Validator requirements is required']
  },
  governanceSettings: {
    type: GovernanceSettingsSchema,
    required: [true, 'Governance settings is required']
  },
  modules: {
    type: [ModuleSchema],
    default: []
  },
  status: {
    type: String,
    enum: ['Created', 'Deploying', 'Active', 'Inactive', 'Failed', 'Updating', 'Restoring'],
    default: 'Created'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Network must have an owner']
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['viewer', 'editor', 'admin'],
      default: 'viewer'
    }
  }],
  metrics: {
    type: NetworkMetricsSchema,
    default: () => ({})
  },
  validators: {
    type: [ValidatorSchema],
    default: []
  },
  backups: {
    type: [BackupSchema],
    default: []
  },
  deployments: {
    type: [DeploymentSchema],
    default: []
  },
  currentDeployment: {
    type: mongoose.Schema.Types.ObjectId
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastBackupAt: Date
});

// Pre-save middleware to update the updatedAt field
NetworkSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for current active deployment
NetworkSchema.virtual('activeDeployment').get(function() {
  if (!this.deployments || this.deployments.length === 0) {
    return null;
  }
  
  return this.deployments.find(d => d.status === 'Active') || null;
});

// Virtual for latest deployment (regardless of status)
NetworkSchema.virtual('latestDeployment').get(function() {
  if (!this.deployments || this.deployments.length === 0) {
    return null;
  }
  
  return this.deployments.sort((a, b) => b.startedAt - a.startedAt)[0] || null;
});

// Method to get latest metrics
NetworkSchema.methods.getLatestMetrics = async function() {
  // In a real implementation, this would fetch the latest metrics from the monitoring service
  return this.metrics;
};

// Method to add a validator
NetworkSchema.methods.addValidator = function(validatorData) {
  this.validators.push(validatorData);
  return this;
};

// Method to update network status
NetworkSchema.methods.updateStatus = function(status) {
  this.status = status;
  return this;
};

// Static method to find networks by owner
NetworkSchema.statics.findByOwner = function(ownerId) {
  return this.find({ owner: ownerId });
};

// Static method to find active networks
NetworkSchema.statics.findActive = function() {
  return this.find({ status: 'Active' });
};

module.exports = mongoose.model('Network', NetworkSchema);