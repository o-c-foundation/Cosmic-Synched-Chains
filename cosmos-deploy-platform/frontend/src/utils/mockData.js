/**
 * Mock Data for Development
 * 
 * This file provides sample data for the application when running in development mode.
 * In production, this data would come from the API.
 */

// Mock networks for development
export const mockNetworks = [
  {
    id: '1',
    name: 'MyCosmosChain',
    chainId: 'mycosmos-1',
    description: 'A test Cosmos blockchain for development',
    status: 'Active',
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2023-01-15T14:45:00Z',
    deployedEnvironment: 'local',
    lastBackupAt: '2023-01-20T08:15:00Z',
    tokenEconomics: {
      name: 'MyCoin',
      symbol: 'MYC',
      decimals: 6,
      initialSupply: 100000000,
      maxSupply: 200000000,
      distribution: {
        validators: 10,
        community: 40,
        foundation: 30,
        airdrop: 20,
      },
    },
    validatorRequirements: {
      minStake: 1000,
      maxValidators: 100,
      unbondingPeriod: 21,
    },
    governanceSettings: {
      votingPeriod: 14,
      quorum: 33.4,
      threshold: 50,
      vetoThreshold: 33.4,
    },
    modules: [
      {
        id: 'bank',
        name: 'Bank',
        enabled: true,
        config: {},
      },
      {
        id: 'staking',
        name: 'Staking',
        enabled: true,
        config: {
          minCommissionRate: 5,
        },
      },
      {
        id: 'gov',
        name: 'Governance',
        enabled: true,
        config: {
          minDeposit: 10000,
        },
      },
      {
        id: 'ibc',
        name: 'IBC',
        enabled: true,
        config: {},
      },
    ],
    metrics: {
      blockHeight: 1245678,
      blockTime: 6.2,
      activeValidators: 50,
      totalStaked: 75000000,
      transactions: {
        total: 9876543,
        perSecond: 12.5,
      },
    },
  },
  {
    id: '2',
    name: 'Enterprise Chain',
    chainId: 'enterprise-1',
    description: 'Private enterprise blockchain with permissioned validators',
    status: 'Created',
    createdAt: '2023-02-10T09:20:00Z',
    updatedAt: '2023-02-10T09:20:00Z',
    tokenEconomics: {
      name: 'Enterprise Token',
      symbol: 'ENT',
      decimals: 8,
      initialSupply: 50000000,
      maxSupply: null,
      distribution: {
        validators: 60,
        community: 0,
        foundation: 40,
        airdrop: 0,
      },
    },
    validatorRequirements: {
      minStake: 10000,
      maxValidators: 10,
      unbondingPeriod: 7,
    },
    governanceSettings: {
      votingPeriod: 3,
      quorum: 51,
      threshold: 67,
      vetoThreshold: 0,
    },
    modules: [
      {
        id: 'bank',
        name: 'Bank',
        enabled: true,
        config: {},
      },
      {
        id: 'staking',
        name: 'Staking',
        enabled: true,
        config: {
          minCommissionRate: 0,
        },
      },
      {
        id: 'gov',
        name: 'Governance',
        enabled: true,
        config: {
          minDeposit: 5000,
        },
      },
      {
        id: 'ibc',
        name: 'IBC',
        enabled: false,
        config: {},
      },
      {
        id: 'wasm',
        name: 'CosmWasm',
        enabled: true,
        config: {
          allowedAddresses: ['enterprise1...', 'enterprise2...'],
        },
      },
    ],
  },
];

// Mock validators
export const mockValidators = [
  {
    address: 'cosmosvaloper156gqf9837u7d4c4678yt3rl4ls9c5vuursrrzf',
    moniker: 'Validator One',
    identity: '1234ABCD',
    website: 'https://validator-one.example',
    details: 'Professional validator service with 99.9% uptime',
    commission: 5,
    uptime: 99.98,
    stake: 5000000,
    status: 'Active',
  },
  {
    address: 'cosmosvaloper1sjllsnramtg3ewxqwwrwjxfgc4n4ef9u2lcnj0',
    moniker: 'Validator Two',
    identity: '5678EFGH',
    website: 'https://validator-two.example',
    details: 'Community validator run by enthusiasts',
    commission: 3,
    uptime: 99.75,
    stake: 2500000,
    status: 'Active',
  },
  {
    address: 'cosmosvaloper1ey69r37gfxvxg62sh4r0ktpuc46pzjrm873ae8',
    moniker: 'Validator Three',
    identity: '9012IJKL',
    website: 'https://validator-three.example',
    details: 'Secure and reliable validation service',
    commission: 8,
    uptime: 100.00,
    stake: 3750000,
    status: 'Active',
  },
  {
    address: 'cosmosvaloper1hjct6q7npsspsg3dgvzk3sdf89spmlpfdn6m9d',
    moniker: 'Validator Four',
    identity: '3456MNOP',
    website: 'https://validator-four.example',
    details: 'High-performance validator with dedicated hardware',
    commission: 10,
    uptime: 98.50,
    stake: 1800000,
    status: 'Jailed',
  },
];

// Mock proposals
export const mockProposals = [
  {
    id: 1,
    title: 'Increase Max Validators',
    description: 'Proposal to increase the maximum number of validators from 100 to 150 to improve decentralization.',
    proposer: 'cosmos1abcdef...',
    type: 'ParameterChange',
    status: 'Passed',
    submitTime: '2023-01-10T12:00:00Z',
    depositEndTime: '2023-01-17T12:00:00Z',
    votingStartTime: '2023-01-17T12:00:00Z',
    votingEndTime: '2023-01-31T12:00:00Z',
    totalDeposit: 15000,
    votes: {
      yes: 75,
      no: 10,
      noWithVeto: 5,
      abstain: 10,
    },
  },
  {
    id: 2,
    title: 'Community Pool Spend',
    description: 'Proposal to allocate 10,000 MYC from the community pool for developer grants.',
    proposer: 'cosmos1ghijkl...',
    type: 'CommunityPoolSpend',
    status: 'Voting',
    submitTime: '2023-02-15T09:30:00Z',
    depositEndTime: '2023-02-22T09:30:00Z',
    votingStartTime: '2023-02-22T09:30:00Z',
    votingEndTime: '2023-03-08T09:30:00Z',
    totalDeposit: 12500,
    votes: {
      yes: 48,
      no: 22,
      noWithVeto: 8,
      abstain: 12,
    },
  },
  {
    id: 3,
    title: 'Enable New Module',
    description: 'Proposal to enable the NFT module on the chain.',
    proposer: 'cosmos1mnopqr...',
    type: 'SoftwareUpgrade',
    status: 'Deposit',
    submitTime: '2023-03-01T15:45:00Z',
    depositEndTime: '2023-03-08T15:45:00Z',
    votingStartTime: '',
    votingEndTime: '',
    totalDeposit: 5000,
    votes: {
      yes: 0,
      no: 0,
      noWithVeto: 0,
      abstain: 0,
    },
  },
];