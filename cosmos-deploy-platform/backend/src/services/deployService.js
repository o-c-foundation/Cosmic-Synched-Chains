/**
 * Deployment Service
 * 
 * Manages the deployment and lifecycle of blockchain networks
 */

const terraform = require('../utils/terraform');
const kubernetes = require('../utils/kubernetes');
const cosmosConfig = require('../utils/cosmosConfig');
const fs = require('fs');
const path = require('path');
const { NetworkDeploymentError } = require('../middlewares/errorHandler');

// Base directory for deployment files
const DEPLOY_BASE_DIR = process.env.DEPLOY_BASE_DIR || '/tmp/cosmos-deploy';

/**
 * Deploy a network to a specified environment
 * @param {Object} network - Network object to deploy
 * @param {string} environment - Target environment (aws, gcp, azure, local)
 * @returns {Promise<Object>} Deployment result
 */
exports.deployNetwork = async (network, environment) => {
  try {
    // Create deployment directory
    const deployDir = path.join(DEPLOY_BASE_DIR, network.chainId);
    
    if (!fs.existsSync(deployDir)) {
      fs.mkdirSync(deployDir, { recursive: true });
    }
    
    // Generate Terraform configuration based on environment
    let tfConfig;
    let deploymentOptions = {
      environment: environment
    };
    
    switch (environment) {
      case 'aws':
        tfConfig = terraform.generateAwsConfig(network, deploymentOptions);
        break;
      case 'gcp':
        tfConfig = terraform.generateGcpConfig(network, deploymentOptions);
        break;
      case 'azure':
        tfConfig = terraform.generateAzureConfig(network, deploymentOptions);
        break;
      case 'local':
        tfConfig = terraform.generateLocalConfig(network, deploymentOptions);
        break;
      default:
        throw new Error(`Unsupported environment: ${environment}`);
    }
    
    // Write Terraform config to files
    await terraform.writeTerraformConfig(tfConfig, deployDir);
    
    // Initialize Terraform
    const initResult = await terraform.executeTerraform('init', deployDir);
    
    if (!initResult.success) {
      throw new NetworkDeploymentError(
        `Failed to initialize Terraform: ${initResult.error}`,
        network.id,
        'initialization',
        initResult.stderr
      );
    }
    
    // Apply Terraform config
    const applyResult = await terraform.executeTerraform('apply -auto-approve', deployDir);
    
    if (!applyResult.success) {
      throw new NetworkDeploymentError(
        `Failed to apply Terraform configuration: ${applyResult.error}`,
        network.id,
        'infrastructure-provisioning',
        applyResult.stderr
      );
    }
    
    // Parse Terraform outputs
    const outputs = terraform.parseTerraformOutput(applyResult.stdout);
    
    // Generate Cosmos configuration
    const genesisConfig = cosmosConfig.generateGenesisConfig(network);
    
    // For production environments, use Kubernetes to deploy Cosmos nodes
    if (environment !== 'local') {
      // Generate Kubernetes manifests
      const k8sManifests = kubernetes.generateManifests(network, outputs);
      
      // Deploy Kubernetes resources
      await kubernetes.applyManifests(k8sManifests, network.chainId);
    } else {
      // For local deployment, write genesis config to files
      const genesisDir = path.join(deployDir, 'genesis');
      
      if (!fs.existsSync(genesisDir)) {
        fs.mkdirSync(genesisDir, { recursive: true });
      }
      
      fs.writeFileSync(
        path.join(genesisDir, 'genesis.json'),
        JSON.stringify(genesisConfig, null, 2)
      );
    }
    
    // Return deployment result with endpoints
    return {
      success: true,
      environment: environment,
      endpoints: {
        rpc: outputs.rpc_endpoint || 'http://localhost:26657',
        rest: outputs.rest_endpoint || 'http://localhost:1317',
        ...outputs
      }
    };
  } catch (error) {
    console.error(`Error deploying network ${network.chainId}:`, error);
    
    // If it's not already a NetworkDeploymentError, wrap it
    if (error.name !== 'NetworkDeploymentError') {
      throw new NetworkDeploymentError(
        `Failed to deploy network: ${error.message}`,
        network.id,
        'deployment',
        error.stack
      );
    }
    
    throw error;
  }
};

/**
 * Terminate a deployed network
 * @param {Object} network - Network object to terminate
 * @returns {Promise<boolean>} Success status
 */
exports.terminateNetwork = async (network) => {
  try {
    // Check if deployment directory exists
    const deployDir = path.join(DEPLOY_BASE_DIR, network.chainId);
    
    if (!fs.existsSync(deployDir)) {
      throw new Error(`Deployment directory not found for ${network.chainId}`);
    }
    
    // For non-local environments, clean up Kubernetes resources first
    if (network.deployedEnvironment !== 'local') {
      await kubernetes.deleteResources(network.chainId);
    }
    
    // Destroy Terraform resources
    const destroyResult = await terraform.executeTerraform('destroy -auto-approve', deployDir);
    
    if (!destroyResult.success) {
      throw new Error(`Failed to destroy infrastructure: ${destroyResult.error}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error terminating network ${network.chainId}:`, error);
    return false;
  }
};

/**
 * Get the status of a network deployment
 * @param {Object} network - Network object
 * @returns {Promise<Object>} Deployment status
 */
exports.getNetworkStatus = async (network) => {
  try {
    let status = {
      deployed: false,
      environment: network.deployedEnvironment,
      endpoints: {},
      resources: {},
      lastChecked: new Date().toISOString()
    };
    
    // Check if deployment directory exists
    const deployDir = path.join(DEPLOY_BASE_DIR, network.chainId);
    
    if (!fs.existsSync(deployDir)) {
      return status;
    }
    
    // Get Terraform outputs
    const outputResult = await terraform.executeTerraform('output -json', deployDir);
    
    if (outputResult.success) {
      try {
        const outputs = JSON.parse(outputResult.stdout);
        
        status.deployed = true;
        status.endpoints = {
          rpc: outputs.rpc_endpoint?.value,
          rest: outputs.rest_endpoint?.value
        };
      } catch (parseError) {
        console.error('Error parsing Terraform output:', parseError);
      }
    }
    
    // For non-local environments, get Kubernetes resources
    if (network.deployedEnvironment !== 'local') {
      const k8sResources = await kubernetes.getResources(network.chainId);
      
      status.resources = k8sResources;
    }
    
    return status;
  } catch (error) {
    console.error(`Error getting network status for ${network.chainId}:`, error);
    return {
      deployed: false,
      error: error.message,
      lastChecked: new Date().toISOString()
    };
  }
};

/**
 * Update the configuration of a running network
 * @param {Object} network - Network object with updated configuration
 * @returns {Promise<boolean>} Success status
 */
exports.updateNetworkConfig = async (network) => {
  try {
    // Check if network is deployed
    const status = await exports.getNetworkStatus(network);
    
    if (!status.deployed) {
      throw new Error('Cannot update configuration for a network that is not deployed');
    }
    
    // For Kubernetes deployments, update ConfigMaps and restart pods
    if (network.deployedEnvironment !== 'local') {
      // Generate updated Cosmos configuration
      const updatedConfig = cosmosConfig.generateConfigUpdates(network);
      
      // Update Kubernetes ConfigMaps
      await kubernetes.updateConfigMaps(network.chainId, updatedConfig);
      
      // Restart pods to apply changes
      await kubernetes.restartDeployment(network.chainId);
    } else {
      // For local deployments, update configuration files
      const deployDir = path.join(DEPLOY_BASE_DIR, network.chainId);
      const genesisDir = path.join(deployDir, 'genesis');
      
      // Generate updated Cosmos configuration
      const updatedConfig = cosmosConfig.generateConfigUpdates(network);
      
      // Write updated configuration to files
      if (updatedConfig.genesis) {
        fs.writeFileSync(
          path.join(genesisDir, 'genesis.json'),
          JSON.stringify(updatedConfig.genesis, null, 2)
        );
      }
      
      if (updatedConfig.config) {
        fs.writeFileSync(
          path.join(genesisDir, 'config.toml'),
          updatedConfig.config
        );
      }
      
      if (updatedConfig.app) {
        fs.writeFileSync(
          path.join(genesisDir, 'app.toml'),
          updatedConfig.app
        );
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Error updating network configuration for ${network.chainId}:`, error);
    return false;
  }
};