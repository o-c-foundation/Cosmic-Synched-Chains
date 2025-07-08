const mongoose = require('mongoose');

const NetworkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  chainId: {
    type: String,
    unique: true,
    required: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['Created', 'Deploying', 'Active', 'Degraded', 'Failed', 'Deleting', 'Deleted'],
    default: 'Created'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  provider: {
    type: String,
    enum: ['aws', 'gcp', 'azure', 'digital_ocean', 'custom'],
    required: true
  },
  region: {
    type: String,
    required: true
  },
  nodeType: {
    type: String,
    required: true
  },
  diskSize: {
    type: Number,
    required: true
  },
  advancedMode: {
    type: Boolean,
    default: false
  },
  tokenEconomics: {
    name: {
      type: String,
      required: true
    },
    symbol: {
      type: String,
      required: true
    },
    decimals: {
      type: Number,
      default: 6
    },
    initialSupply: {
      type: Number,
      required: true
    },
    maxSupply: {
      type: Number
    },
    inflationRate: {
      type: Number,
      default: 7
    },
    inflationRateChange: {
      type: Number,
      default: 0.13
    },
    inflationMax: {
      type: Number,
      default: 20
    },
    inflationMin: {
      type: Number,
      default: 2
    },
    bondedRatioGoal: {
      type: Number,
      default: 67
    },
    blocksPerYear: {
      type: Number,
      default: 6311520
    },
    communityTax: {
      type: Number,
      default: 2
    },
    validatorsAllocation: {
      type: Number,
      default: 40
    },
    communityPoolAllocation: {
      type: Number,
      default: 30
    },
    strategicReserveAllocation: {
      type: Number,
      default: 20
    },
    airdropAllocation: {
      type: Number,
      default: 10
    }
  },
  validators: {
    count: {
      type: Number,
      default: 4
    },
    blockTime: {
      type: Number,
      default: 5
    },
    unbondingTime: {
      type: Number,
      default: 21
    },
    maxValidators: {
      type: Number,
      default: 100
    },
    maxEntries: {
      type: Number,
      default: 7
    },
    historicalEntries: {
      type: Number,
      default: 10000
    },
    customValidators: [
      {
        moniker: String,
        power: Number,
        commission: {
          rate: Number,
          maxRate: Number,
          maxChangeRate: Number
        },
        details: String,
        website: String,
        identity: String
      }
    ]
  },
  governance: {
    minDeposit: {
      type: Number,
      default: 10000
    },
    maxDepositPeriod: {
      type: Number,
      default: 14
    },
    votingPeriod: {
      type: Number,
      default: 14
    },
    quorum: {
      type: Number,
      default: 33.4
    },
    threshold: {
      type: Number,
      default: 50
    },
    vetoThreshold: {
      type: Number,
      default: 33.4
    },
    enabledProposalTypes: {
      type: [String],
      default: ['text', 'parameter_change', 'community_pool_spend', 'software_upgrade', 'cancel_software_upgrade']
    }
  },
  modules: {
    enabled: {
      type: [String],
      default: ['bank', 'staking', 'distribution', 'gov', 'slashing', 'ibc', 'authz', 'feegrant']
    },
    params: {
      type: Object,
      default: {}
    }
  },
  deployedEnvironment: {
    type: String
  },
  lastBackupAt: {
    type: Date
  },
  metrics: {
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
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Set chainId based on name before saving
NetworkSchema.pre('save', function(next) {
  // Only set chainId if it's a new document or name has changed
  if (this.isNew || this.isModified('name')) {
    this.chainId = `${this.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-1`;
  }
  
  // Update the updatedAt field
  this.updatedAt = Date.now();
  
  next();
});

module.exports = mongoose.model('Network', NetworkSchema);