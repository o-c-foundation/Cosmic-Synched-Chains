/**
 * Monitoring Service
 * 
 * Provides functions for collecting and analyzing blockchain network metrics
 */

const axios = require('axios');
const { ResourceNotFoundError } = require('../middlewares/errorHandler');

/**
 * Get metrics for a specific network
 * @param {Object} network - Network object
 * @returns {Promise<Object>} - Network metrics
 */
exports.getNetworkMetrics = async (network) => {
  try {
    // Check if network is active
    if (network.status !== 'Active') {
      throw new Error('Cannot get metrics for a network that is not active');
    }
    
    // Get deployment details to find endpoints
    const deployment = network.deployments.find(d => d.status === 'Active');
    
    if (!deployment) {
      throw new Error('No active deployment found');
    }
    
    // Depending on the environment, we'll fetch metrics from different sources
    let metrics = {};
    
    if (deployment.environment === 'local') {
      // For local deployment, try to get metrics from local Prometheus
      metrics = await getLocalMetrics(network.chainId);
    } else {
      // For cloud deployments, fetch from the respective monitoring endpoints
      const prometheusUrl = deployment.endpoints?.metrics;
      
      if (prometheusUrl) {
        metrics = await fetchPrometheusMetrics(prometheusUrl, network.chainId);
      } else {
        // If no metrics endpoint, use basic RPC endpoint for minimal metrics
        const rpcUrl = deployment.endpoints?.rpc;
        
        if (rpcUrl) {
          metrics = await fetchRpcMetrics(rpcUrl);
        }
      }
    }
    
    // Combine with existing metrics and return
    const combinedMetrics = {
      ...network.metrics,
      ...metrics,
      updatedAt: new Date().toISOString()
    };
    
    // Update network metrics in database
    await updateNetworkMetrics(network.id, combinedMetrics);
    
    return combinedMetrics;
  } catch (error) {
    console.error(`Error getting metrics for network ${network.chainId}:`, error);
    throw error;
  }
};

/**
 * Fetch metrics from Prometheus
 * @param {string} prometheusUrl - Prometheus URL
 * @param {string} chainId - Chain ID for filtering metrics
 * @returns {Promise<Object>} - Network metrics
 */
async function fetchPrometheusMetrics(prometheusUrl, chainId) {
  try {
    // Define queries for different metrics
    const queries = {
      blockHeight: `cosmos_block_height{chain_id="${chainId}"}`,
      blockTime: `avg_over_time(cosmos_block_time_seconds{chain_id="${chainId}"}[5m])`,
      activeValidators: `cosmos_validators_active{chain_id="${chainId}"}`,
      totalStaked: `cosmos_staking_tokens_bonded{chain_id="${chainId}"}`,
      transactionsTotal: `cosmos_transactions_total{chain_id="${chainId}"}`,
      transactionsPerSecond: `rate(cosmos_transactions_total{chain_id="${chainId}"}[5m])`
    };
    
    // Execute queries and collect results
    const metrics = {};
    
    for (const [key, query] of Object.entries(queries)) {
      try {
        const response = await axios.get(`${prometheusUrl}/api/v1/query`, {
          params: { query }
        });
        
        if (response.data.status === 'success' && response.data.data.result.length > 0) {
          metrics[key] = parseFloat(response.data.data.result[0].value[1]);
        }
      } catch (error) {
        console.warn(`Error fetching ${key} metric:`, error.message);
      }
    }
    
    // Format metrics to match our schema
    return {
      blockHeight: metrics.blockHeight || 0,
      blockTime: metrics.blockTime || 0,
      activeValidators: metrics.activeValidators || 0,
      totalStaked: metrics.totalStaked || 0,
      transactions: {
        total: metrics.transactionsTotal || 0,
        perSecond: metrics.transactionsPerSecond || 0
      }
    };
  } catch (error) {
    console.error('Error fetching Prometheus metrics:', error);
    return {};
  }
}

/**
 * Fetch basic metrics from RPC endpoint
 * @param {string} rpcUrl - Tendermint RPC URL
 * @returns {Promise<Object>} - Basic network metrics
 */
async function fetchRpcMetrics(rpcUrl) {
  try {
    // Fetch status for basic metrics
    const statusResponse = await axios.get(`${rpcUrl}/status`);
    const statusData = statusResponse.data.result;
    
    // Fetch validators count
    const validatorsResponse = await axios.get(`${rpcUrl}/validators`);
    const validatorsData = validatorsResponse.data.result;
    
    // Extract and format metrics
    return {
      blockHeight: parseInt(statusData.sync_info.latest_block_height, 10) || 0,
      blockTime: parseFloat(statusData.result?.block_time_seconds) || 6, // Default if not available
      activeValidators: validatorsData.validators.length || 0,
      totalStaked: 0, // Not available from basic RPC
      transactions: {
        total: 0, // Not available from basic RPC
        perSecond: 0 // Not available from basic RPC
      }
    };
  } catch (error) {
    console.error('Error fetching RPC metrics:', error);
    return {};
  }
}

/**
 * Get metrics from local deployment
 * @param {string} chainId - Chain ID
 * @returns {Promise<Object>} - Network metrics
 */
async function getLocalMetrics(chainId) {
  try {
    // For local deployment, try to connect to localhost
    const rpcUrl = `http://localhost:26657`;
    return await fetchRpcMetrics(rpcUrl);
  } catch (error) {
    console.error('Error fetching local metrics:', error);
    return {};
  }
}

/**
 * Update network metrics in database
 * @param {string} networkId - Network ID
 * @param {Object} metrics - Updated metrics
 * @returns {Promise<void>}
 */
async function updateNetworkMetrics(networkId, metrics) {
  try {
    // In a real implementation, this would update the database
    // For now, it's just a placeholder
    console.log(`Updated metrics for network ${networkId}`);
  } catch (error) {
    console.error('Error updating network metrics:', error);
  }
}

/**
 * Set up monitoring for a network
 * @param {Object} network - Network object
 * @param {Object} options - Monitoring options
 * @returns {Promise<Object>} - Monitoring configuration
 */
exports.setupMonitoring = async (network, options = {}) => {
  try {
    // Get active deployment
    const deployment = network.deployments.find(d => d.status === 'Active');
    
    if (!deployment) {
      throw new Error('No active deployment found');
    }
    
    // Set up monitoring based on environment
    if (deployment.environment === 'local') {
      return await setupLocalMonitoring(network, options);
    } else {
      return await setupCloudMonitoring(network, deployment, options);
    }
  } catch (error) {
    console.error(`Error setting up monitoring for network ${network.chainId}:`, error);
    throw error;
  }
};

/**
 * Set up monitoring for local deployment
 * @param {Object} network - Network object
 * @param {Object} options - Monitoring options
 * @returns {Promise<Object>} - Monitoring configuration
 */
async function setupLocalMonitoring(network, options) {
  // In a real implementation, this would set up local Prometheus and Grafana
  return {
    prometheus: 'http://localhost:9090',
    grafana: 'http://localhost:3000',
    dashboardUrl: 'http://localhost:3000/d/cosmos/cosmos-overview',
    alertsConfigured: true
  };
}

/**
 * Set up monitoring for cloud deployment
 * @param {Object} network - Network object
 * @param {Object} deployment - Deployment object
 * @param {Object} options - Monitoring options
 * @returns {Promise<Object>} - Monitoring configuration
 */
async function setupCloudMonitoring(network, deployment, options) {
  // In a real implementation, this would set up cloud-based monitoring
  return {
    prometheus: deployment.endpoints?.metrics || '',
    grafana: deployment.endpoints?.grafana || '',
    dashboardUrl: deployment.endpoints?.grafana ? `${deployment.endpoints.grafana}/d/cosmos/cosmos-overview` : '',
    alertsConfigured: true
  };
}

/**
 * Configure alerts for a network
 * @param {Object} network - Network object
 * @param {Array} alerts - Alert configurations
 * @returns {Promise<boolean>} - Success status
 */
exports.configureAlerts = async (network, alerts) => {
  try {
    // In a real implementation, this would configure alerting rules
    console.log(`Configured alerts for network ${network.chainId}`);
    return true;
  } catch (error) {
    console.error(`Error configuring alerts for network ${network.chainId}:`, error);
    return false;
  }
};

/**
 * Get monitoring dashboard URL
 * @param {Object} network - Network object
 * @returns {Promise<string>} - Dashboard URL
 */
exports.getDashboardUrl = async (network) => {
  try {
    // Get active deployment
    const deployment = network.deployments.find(d => d.status === 'Active');
    
    if (!deployment) {
      return '';
    }
    
    if (deployment.environment === 'local') {
      return 'http://localhost:3000/d/cosmos/cosmos-overview';
    } else {
      return deployment.endpoints?.grafana ? `${deployment.endpoints.grafana}/d/cosmos/cosmos-overview` : '';
    }
  } catch (error) {
    console.error(`Error getting dashboard URL for network ${network.chainId}:`, error);
    return '';
  }
};