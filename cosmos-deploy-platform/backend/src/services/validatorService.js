/**
 * Validator Service
 * 
 * Provides functions for managing validators in the blockchain network
 */

const axios = require('axios');
const { ResourceNotFoundError } = require('../middlewares/errorHandler');

/**
 * Get validators for a specific network
 * @param {Object} network - Network object
 * @returns {Promise<Array>} - List of validators
 */
exports.getNetworkValidators = async (network) => {
  try {
    // Check if network is active
    if (network.status !== 'Active') {
      // For non-active networks, return validators from database
      return network.validators || [];
    }
    
    // Get active deployment
    const deployment = network.deployments.find(d => d.status === 'Active');
    
    if (!deployment) {
      // If no active deployment, return validators from database
      return network.validators || [];
    }
    
    // Get validators from blockchain node
    const validators = await fetchValidatorsFromNode(deployment);
    
    // Update validator information with data from blockchain
    return updateValidatorInfo(network.validators || [], validators);
  } catch (error) {
    console.error(`Error getting validators for network ${network.chainId}:`, error);
    // Fall back to database validators
    return network.validators || [];
  }
};

/**
 * Fetch validators from blockchain node
 * @param {Object} deployment - Deployment details
 * @returns {Promise<Array>} - List of validators from the blockchain
 */
async function fetchValidatorsFromNode(deployment) {
  try {
    // Get RPC endpoint
    const rpcUrl = deployment.endpoints?.rpc;
    
    if (!rpcUrl) {
      throw new Error('No RPC endpoint available');
    }
    
    // Fetch validators from RPC
    const response = await axios.get(`${rpcUrl}/validators`);
    
    if (!response.data || !response.data.result || !response.data.result.validators) {
      throw new Error('Invalid response from RPC endpoint');
    }
    
    // Transform validators to our format
    const validators = response.data.result.validators.map(v => ({
      address: v.address,
      pubKey: v.pub_key?.value,
      votingPower: parseInt(v.voting_power, 10),
      proposerPriority: parseInt(v.proposer_priority, 10)
    }));
    
    // Fetch additional validator info from REST API
    const restUrl = deployment.endpoints?.rest;
    
    if (restUrl) {
      const stakingResponse = await axios.get(`${restUrl}/cosmos/staking/v1beta1/validators`);
      
      if (stakingResponse.data && stakingResponse.data.validators) {
        // Enhance validators with additional info
        for (const validator of validators) {
          const stakingValidator = stakingResponse.data.validators.find(
            sv => sv.operator_address === validator.address
          );
          
          if (stakingValidator) {
            validator.moniker = stakingValidator.description?.moniker || '';
            validator.identity = stakingValidator.description?.identity || '';
            validator.website = stakingValidator.description?.website || '';
            validator.details = stakingValidator.description?.details || '';
            validator.commission = parseFloat(stakingValidator.commission?.commission_rates?.rate || '0') * 100;
            validator.stake = parseInt(stakingValidator.tokens, 10) / 1000000; // Convert to tokens
            validator.status = stakingValidator.status === 3 ? 'Active' : 
                              stakingValidator.status === 1 ? 'Unbonding' : 'Inactive';
          }
        }
      }
    }
    
    return validators;
  } catch (error) {
    console.error('Error fetching validators from node:', error);
    return [];
  }
}

/**
 * Update validator information by combining blockchain data with database
 * @param {Array} dbValidators - Validators from database
 * @param {Array} chainValidators - Validators from blockchain
 * @returns {Array} - Updated validators
 */
function updateValidatorInfo(dbValidators, chainValidators) {
  const updatedValidators = [...dbValidators];
  
  // Update existing validators
  for (const chainValidator of chainValidators) {
    const existingIndex = updatedValidators.findIndex(v => v.address === chainValidator.address);
    
    if (existingIndex >= 0) {
      // Update existing validator
      updatedValidators[existingIndex] = {
        ...updatedValidators[existingIndex],
        ...chainValidator,
        // Don't override these fields if they exist in DB
        moniker: chainValidator.moniker || updatedValidators[existingIndex].moniker,
        identity: chainValidator.identity || updatedValidators[existingIndex].identity,
        website: chainValidator.website || updatedValidators[existingIndex].website,
        details: chainValidator.details || updatedValidators[existingIndex].details,
      };
    } else {
      // Add new validator
      updatedValidators.push(chainValidator);
    }
  }
  
  return updatedValidators;
}

/**
 * Add a new validator to the network
 * @param {Object} network - Network object
 * @param {Object} validatorData - Validator details
 * @returns {Promise<Object>} - Created validator
 */
exports.addValidator = async (network, validatorData) => {
  try {
    // Check if network is active
    if (network.status !== 'Active') {
      throw new Error('Cannot add validator to a network that is not active');
    }
    
    // Check if validator already exists
    if (network.validators && network.validators.some(v => v.address === validatorData.address)) {
      throw new Error(`Validator with address ${validatorData.address} already exists`);
    }
    
    // Get active deployment
    const deployment = network.deployments.find(d => d.status === 'Active');
    
    if (!deployment) {
      throw new Error('No active deployment found');
    }
    
    // Generate keys and create validator on the blockchain
    const validator = await createValidatorOnChain(deployment, validatorData);
    
    // Return the created validator
    return validator;
  } catch (error) {
    console.error(`Error adding validator to network ${network.chainId}:`, error);
    throw error;
  }
};

/**
 * Create validator on the blockchain
 * @param {Object} deployment - Deployment details
 * @param {Object} validatorData - Validator details
 * @returns {Promise<Object>} - Created validator
 */
async function createValidatorOnChain(deployment, validatorData) {
  // In a real implementation, this would interact with the blockchain
  // to create a validator by generating keys and submitting a transaction
  
  // For now, we'll just simulate creating a validator
  return {
    address: validatorData.address || `cosmosvaloper${Math.random().toString(36).substring(2, 15)}`,
    moniker: validatorData.moniker,
    identity: validatorData.identity || '',
    website: validatorData.website || '',
    details: validatorData.details || '',
    commission: validatorData.commission || 5,
    uptime: 100, // New validator starts with 100% uptime
    stake: validatorData.stake || 0,
    status: 'Active'
  };
}

/**
 * Update a validator
 * @param {Object} network - Network object
 * @param {string} validatorId - Validator address
 * @param {Object} updates - Updates to apply
 * @returns {Promise<Object>} - Updated validator
 */
exports.updateValidator = async (network, validatorId, updates) => {
  try {
    // Check if network is active
    if (network.status !== 'Active') {
      throw new Error('Cannot update validator for a network that is not active');
    }
    
    // Find the validator
    const validatorIndex = network.validators.findIndex(v => v.address === validatorId);
    
    if (validatorIndex === -1) {
      throw new ResourceNotFoundError('Validator', `Validator not found with address ${validatorId}`);
    }
    
    // Get active deployment
    const deployment = network.deployments.find(d => d.status === 'Active');
    
    if (!deployment) {
      throw new Error('No active deployment found');
    }
    
    // Update validator on the blockchain
    await updateValidatorOnChain(deployment, validatorId, updates);
    
    // Create updated validator object
    const updatedValidator = {
      ...network.validators[validatorIndex],
      ...updates
    };
    
    return updatedValidator;
  } catch (error) {
    console.error(`Error updating validator ${validatorId} for network ${network.chainId}:`, error);
    throw error;
  }
};

/**
 * Update validator on the blockchain
 * @param {Object} deployment - Deployment details
 * @param {string} validatorId - Validator address
 * @param {Object} updates - Updates to apply
 * @returns {Promise<void>}
 */
async function updateValidatorOnChain(deployment, validatorId, updates) {
  // In a real implementation, this would interact with the blockchain
  // to update a validator by submitting a transaction
  
  // For now, we'll just log the update
  console.log(`Updated validator ${validatorId} on blockchain`);
}

/**
 * Remove a validator from the network
 * @param {Object} network - Network object
 * @param {string} validatorId - Validator address
 * @returns {Promise<boolean>} - Success status
 */
exports.removeValidator = async (network, validatorId) => {
  try {
    // Check if network is active
    if (network.status !== 'Active') {
      throw new Error('Cannot remove validator from a network that is not active');
    }
    
    // Find the validator
    const validatorIndex = network.validators.findIndex(v => v.address === validatorId);
    
    if (validatorIndex === -1) {
      throw new ResourceNotFoundError('Validator', `Validator not found with address ${validatorId}`);
    }
    
    // Get active deployment
    const deployment = network.deployments.find(d => d.status === 'Active');
    
    if (!deployment) {
      throw new Error('No active deployment found');
    }
    
    // Remove validator from the blockchain (or jail it)
    await removeValidatorFromChain(deployment, validatorId);
    
    return true;
  } catch (error) {
    console.error(`Error removing validator ${validatorId} from network ${network.chainId}:`, error);
    throw error;
  }
};

/**
 * Remove validator from the blockchain
 * @param {Object} deployment - Deployment details
 * @param {string} validatorId - Validator address
 * @returns {Promise<void>}
 */
async function removeValidatorFromChain(deployment, validatorId) {
  // In a real implementation, this would interact with the blockchain
  // to remove or jail a validator by submitting a transaction
  
  // For now, we'll just log the removal
  console.log(`Removed validator ${validatorId} from blockchain`);
}

/**
 * Get validator performance metrics
 * @param {Object} network - Network object
 * @param {string} validatorId - Validator address
 * @returns {Promise<Object>} - Validator performance metrics
 */
exports.getValidatorPerformance = async (network, validatorId) => {
  try {
    // Check if network is active
    if (network.status !== 'Active') {
      throw new Error('Cannot get validator performance for a network that is not active');
    }
    
    // Find the validator
    const validator = network.validators.find(v => v.address === validatorId);
    
    if (!validator) {
      throw new ResourceNotFoundError('Validator', `Validator not found with address ${validatorId}`);
    }
    
    // Get active deployment
    const deployment = network.deployments.find(d => d.status === 'Active');
    
    if (!deployment) {
      throw new Error('No active deployment found');
    }
    
    // Get validator performance from monitoring service
    const performance = await getValidatorPerformanceMetrics(deployment, validatorId);
    
    return performance;
  } catch (error) {
    console.error(`Error getting performance for validator ${validatorId}:`, error);
    
    // Return basic metrics in case of error
    return {
      uptime: validator ? validator.uptime : 0,
      blocksProposed: 0,
      blocksSignedPercent: 0,
      delegatedStake: validator ? validator.stake : 0,
      commissionEarned: 0,
      lastUpdated: new Date().toISOString()
    };
  }
};

/**
 * Get validator performance metrics from monitoring service
 * @param {Object} deployment - Deployment details
 * @param {string} validatorId - Validator address
 * @returns {Promise<Object>} - Validator performance metrics
 */
async function getValidatorPerformanceMetrics(deployment, validatorId) {
  try {
    // In a real implementation, this would fetch metrics from Prometheus or similar
    
    // For now, return mock performance data
    return {
      uptime: 99.8,
      blocksProposed: 1250,
      blocksSignedPercent: 99.9,
      delegatedStake: 500000,
      commissionEarned: 1500,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching validator performance metrics:', error);
    throw error;
  }
}