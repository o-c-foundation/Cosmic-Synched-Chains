const fs = require('fs-extra');
const path = require('path');
const { exec, spawn } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const Network = require('../models/Network');
const kubernetes = require('../utils/kubernetes');
const terraform = require('../utils/terraform');
const cosmosConfig = require('../utils/cosmosConfig');
const config = require('../config');

/**
 * Service for handling blockchain network deployments
 */
class DeploymentService {
  constructor() {
    this.workDir = config.workDir || '/tmp/cosmos-deploy';
    this.templatesDir = path.join(__dirname, '../../templates');
    
    // Ensure work directory exists
    fs.ensureDirSync(this.workDir);
  }
  
  /**
   * Deploy a new Cosmos blockchain network
   * @param {string} networkId - The ID of the network to deploy
   * @param {string} environment - The deployment environment (e.g., 'production', 'staging')
   * @returns {Promise<object>} - Deployment status
   */
  async deployNetwork(networkId, environment) {
    try {
      // Get network from database
      const network = await Network.findById(networkId);
      if (!network) {
        throw new Error(`Network with ID ${networkId} not found`);
      }
      
      // Create unique workspace for this deployment
      const workspacePath = path.join(this.workDir, `${network.name}-${Date.now()}`);
      fs.ensureDirSync(workspacePath);
      
      // Update network status to Deploying
      network.status = 'Deploying';
      network.deployedEnvironment = environment;
      await network.save();
      
      // Create network configuration files
      await this.generateNetworkConfig(network, workspacePath);
      
      // Determine deployment method based on environment
      let deploymentResult;
      
      if (environment === 'local' || environment === 'development') {
        deploymentResult = await this.deployWithDocker(network, workspacePath);
      } else {
        // For production or staging, use Kubernetes
        deploymentResult = await this.deployWithKubernetes(network, workspacePath);
      }
      
      // Update network with deployment info
      network.status = 'Active';
      network.deploymentInfo = deploymentResult;
      await network.save();
      
      return {
        success: true,
        network,
        deploymentInfo: deploymentResult
      };
    } catch (error) {
      console.error(`Deployment failed for network ${networkId}:`, error);
      
      // Update network status to Failed
      try {
        const network = await Network.findById(networkId);
        if (network) {
          network.status = 'Failed';
          network.failureReason = error.message;
          await network.save();
        }
      } catch (err) {
        console.error('Failed to update network status:', err);
      }
      
      throw error;
    }
  }
  
  /**
   * Generate network configuration files using Ignite CLI and templates
   * @param {object} network - Network model instance
   * @param {string} workspacePath - Path to deployment workspace
   * @returns {Promise<void>}
   */
  async generateNetworkConfig(network, workspacePath) {
    try {
      const chainId = network.chainId;
      const projectPath = path.join(workspacePath, chainId);
      
      console.log(`Generating network configuration for ${chainId} at ${projectPath}`);
      
      // 1. Use Ignite CLI to scaffold a new Cosmos SDK chain
      await this.runIgniteScaffold(chainId, projectPath);
      
      // 2. Customize the chain configuration based on network parameters
      await this.customizeChainConfig(network, projectPath);
      
      // 3. Generate genesis file with initial validators and token distribution
      await this.generateGenesis(network, projectPath);
      
      // 4. Create Docker and Kubernetes configuration files
      await this.generateDeploymentConfig(network, projectPath);
      
      return projectPath;
    } catch (error) {
      console.error('Error generating network configuration:', error);
      throw error;
    }
  }
  
  /**
   * Run Ignite CLI to scaffold a new Cosmos SDK chain
   * @param {string} chainId - Chain ID
   * @param {string} projectPath - Path to project directory
   * @returns {Promise<void>}
   */
  async runIgniteScaffold(chainId, projectPath) {
    try {
      console.log(`Scaffolding new chain with Ignite CLI: ${chainId}`);
      
      // Create project directory
      fs.ensureDirSync(path.dirname(projectPath));
      
      // Run Ignite scaffold command
      const command = `ignite scaffold chain ${chainId} --address-prefix ${chainId.split('-')[0]} --no-module`;
      const { stdout, stderr } = await execPromise(command, { cwd: path.dirname(projectPath) });
      
      console.log('Ignite scaffold output:', stdout);
      
      if (stderr && stderr.trim() !== '') {
        console.warn('Ignite scaffold stderr:', stderr);
      }
      
      return true;
    } catch (error) {
      console.error('Error running Ignite scaffold:', error);
      throw error;
    }
  }
  
  /**
   * Customize the chain configuration based on network parameters
   * @param {object} network - Network model instance
   * @param {string} projectPath - Path to project directory
   * @returns {Promise<void>}
   */
  async customizeChainConfig(network, projectPath) {
    try {
      console.log(`Customizing chain configuration for ${network.chainId}`);
      
      // 1. Configure app.toml
      await cosmosConfig.updateAppConfig(network, projectPath);
      
      // 2. Configure config.toml
      await cosmosConfig.updateNodeConfig(network, projectPath);
      
      // 3. Configure client.toml
      await cosmosConfig.updateClientConfig(network, projectPath);
      
      // 4. Add enabled modules
      await this.configureModules(network, projectPath);
      
      return true;
    } catch (error) {
      console.error('Error customizing chain configuration:', error);
      throw error;
    }
  }
  
  /**
   * Configure the modules to be enabled in the chain
   * @param {object} network - Network model instance
   * @param {string} projectPath - Path to project directory
   * @returns {Promise<void>}
   */
  async configureModules(network, projectPath) {
    try {
      console.log(`Configuring modules for ${network.chainId}`);
      
      // Get enabled modules
      const enabledModules = network.modules?.enabled || [];
      
      // For each optional module, scaffold it if enabled
      for (const module of enabledModules) {
        if (!CORE_MODULES.includes(module)) {
          // Skip core modules as they're already included
          await this.scaffoldModule(module, network, projectPath);
        }
      }
      
      // Apply module parameters
      if (network.modules?.params) {
        await cosmosConfig.updateModuleParams(network.modules.params, projectPath);
      }
      
      return true;
    } catch (error) {
      console.error('Error configuring modules:', error);
      throw error;
    }
  }
  
  /**
   * Scaffold a module using Ignite CLI
   * @param {string} module - Module name
   * @param {object} network - Network model instance
   * @param {string} projectPath - Path to project directory
   * @returns {Promise<void>}
   */
  async scaffoldModule(module, network, projectPath) {
    try {
      console.log(`Scaffolding module ${module} for ${network.chainId}`);
      
      // Map our module names to Ignite CLI module names
      const moduleMap = {
        'ibc': 'ibc',
        'authz': 'authz',
        'feegrant': 'feegrant',
        'group': 'group',
        'nft': 'nft',
        'wasm': 'wasm'
        // Add more mappings as needed
      };
      
      // Check if module is supported
      if (!moduleMap[module]) {
        console.warn(`Module ${module} is not supported for scaffolding, skipping`);
        return false;
      }
      
      // For WASM, special handling
      if (module === 'wasm') {
        return await this.scaffoldWasmModule(network, projectPath);
      }
      
      // Run Ignite scaffold module command for standard modules
      const command = `ignite scaffold module ${moduleMap[module]} --require-registration`;
      const { stdout, stderr } = await execPromise(command, { cwd: projectPath });
      
      console.log(`Scaffold ${module} output:`, stdout);
      
      if (stderr && stderr.trim() !== '') {
        console.warn(`Scaffold ${module} stderr:`, stderr);
      }
      
      return true;
    } catch (error) {
      console.error(`Error scaffolding module ${module}:`, error);
      throw error;
    }
  }
  
  /**
   * Special handling for CosmWasm module
   * @param {object} network - Network model instance
   * @param {string} projectPath - Path to project directory
   * @returns {Promise<void>}
   */
  async scaffoldWasmModule(network, projectPath) {
    try {
      console.log(`Setting up CosmWasm for ${network.chainId}`);
      
      // For CosmWasm, we need to integrate the module manually
      // Clone wasmd repository
      const wasmdPath = path.join(projectPath, 'wasmd');
      const cloneCommand = `git clone https://github.com/CosmWasm/wasmd.git ${wasmdPath}`;
      await execPromise(cloneCommand);
      
      // Configure go.mod to include wasmd
      const goModPath = path.join(projectPath, 'go.mod');
      let goModContent = await fs.readFile(goModPath, 'utf8');
      
      // Add wasmd to imports
      goModContent = goModContent.replace(
        'require (',
        'require (\n\tgithub.com/CosmWasm/wasmd v0.30.0'
      );
      
      await fs.writeFile(goModPath, goModContent);
      
      // Run go mod tidy
      await execPromise('go mod tidy', { cwd: projectPath });
      
      // Configure app.go to include wasm module
      const appGoPath = path.join(projectPath, 'app/app.go');
      let appGoContent = await fs.readFile(appGoPath, 'utf8');
      
      // Add wasm imports
      appGoContent = appGoContent.replace(
        'import (',
        'import (\n\t"github.com/CosmWasm/wasmd/x/wasm"\n\twasmkeeper "github.com/CosmWasm/wasmd/x/wasm/keeper"'
      );
      
      // Add wasm to module manager
      appGoContent = appGoContent.replace(
        '// this line is used by starport scaffolding # stargate/app/moduleImport',
        'wasm.AppModuleBasic{},\n\t\t// this line is used by starport scaffolding # stargate/app/moduleImport'
      );
      
      // Add wasm keeper
      appGoContent = appGoContent.replace(
        '// this line is used by starport scaffolding # stargate/app/keeperDeclaration',
        'WasmKeeper        wasmkeeper.Keeper\n\t// this line is used by starport scaffolding # stargate/app/keeperDeclaration'
      );
      
      // Add wasm module initialization
      appGoContent = appGoContent.replace(
        '// this line is used by starport scaffolding # stargate/app/moduleInit',
        'app.WasmKeeper = wasmkeeper.NewKeeper(\n\t\tappCodec,\n\t\tkeys[wasm.StoreKey],\n\t\tapp.GetSubspace(wasm.ModuleName),\n\t\tapp.AccountKeeper,\n\t\tapp.BankKeeper,\n\t\tapp.StakingKeeper,\n\t\tapp.DistrKeeper,\n\t\tapp.IBCKeeper.ChannelKeeper,\n\t\t&app.IBCKeeper.PortKeeper,\n\t\tapp.TransferKeeper,\n\t\tapp.Router(),\n\t\tapp.GRPCQueryRouter(),\n\t\tdir,\n\t\twasm.DefaultWasmConfig(),\n\t\t"cosmwasm",\n\t)\n\n\t// this line is used by starport scaffolding # stargate/app/moduleInit'
      );
      
      await fs.writeFile(appGoPath, appGoContent);
      
      return true;
    } catch (error) {
      console.error('Error scaffolding WASM module:', error);
      throw error;
    }
  }
  
  /**
   * Generate genesis file with initial validators and token distribution
   * @param {object} network - Network model instance
   * @param {string} projectPath - Path to project directory
   * @returns {Promise<void>}
   */
  async generateGenesis(network, projectPath) {
    try {
      console.log(`Generating genesis for ${network.chainId}`);
      
      // 1. Initialize genesis
      await execPromise(`ignite chain init`, { cwd: projectPath });
      
      // 2. Update genesis with network token economics
      await cosmosConfig.updateGenesisTokenEconomics(network, projectPath);
      
      // 3. Add validators
      await this.addGenesisValidators(network, projectPath);
      
      // 4. Update governance parameters
      await cosmosConfig.updateGenesisGovernance(network, projectPath);
      
      return true;
    } catch (error) {
      console.error('Error generating genesis:', error);
      throw error;
    }
  }
  
  /**
   * Add validators to genesis file
   * @param {object} network - Network model instance
   * @param {string} projectPath - Path to project directory
   * @returns {Promise<void>}
   */
  async addGenesisValidators(network, projectPath) {
    try {
      console.log(`Adding validators to genesis for ${network.chainId}`);
      
      const validatorCount = network.validators?.count || 4;
      const validatorBasePath = path.join(projectPath, 'validators');
      fs.ensureDirSync(validatorBasePath);
      
      // Use custom validators if provided, otherwise generate default ones
      const validators = network.validators?.customValidators || 
        Array.from({ length: validatorCount }, (_, i) => ({
          moniker: `validator-${i + 1}`,
          power: 100 / validatorCount,
          commission: {
            rate: 5,
            maxRate: 20,
            maxChangeRate: 1
          }
        }));
      
      // Generate keys and add validators to genesis
      for (let i = 0; i < validators.length; i++) {
        const validator = validators[i];
        const validatorPath = path.join(validatorBasePath, `validator-${i+1}`);
        fs.ensureDirSync(validatorPath);
        
        // Generate validator key
        await execPromise(`${projectPath}/build/${network.chainId}d keys add validator-${i+1} --keyring-backend test --home ${validatorPath}`);
        
        // Get validator address
        const { stdout } = await execPromise(`${projectPath}/build/${network.chainId}d keys show validator-${i+1} -a --keyring-backend test --home ${validatorPath}`);
        const validatorAddress = stdout.trim();
        
        // Add genesis account with tokens
        const power = Math.floor((validator.power / 100) * network.tokenEconomics.initialSupply * (network.tokenEconomics.validatorsAllocation / 100));
        await execPromise(`${projectPath}/build/${network.chainId}d add-genesis-account ${validatorAddress} ${power}${network.tokenEconomics.symbol.toLowerCase()} --home ${projectPath}/config`);
        
        // Create validator transaction
        const commission = validator.commission || { rate: 5, maxRate: 20, maxChangeRate: 1 };
        await execPromise(`${projectPath}/build/${network.chainId}d gentx validator-${i+1} ${power/2}${network.tokenEconomics.symbol.toLowerCase()} --chain-id ${network.chainId} --commission-rate ${commission.rate/100} --commission-max-rate ${commission.maxRate/100} --commission-max-change-rate ${commission.maxChangeRate/100} --moniker "${validator.moniker}" --website "${validator.website || ''}" --identity "${validator.identity || ''}" --details "${validator.details || ''}" --keyring-backend test --home ${validatorPath}`);
        
        // Copy gentx to project
        await fs.copy(
          path.join(validatorPath, 'config/gentx'),
          path.join(projectPath, 'config/gentx')
        );
      }
      
      // Collect gentxs
      await execPromise(`${projectPath}/build/${network.chainId}d collect-gentxs --home ${projectPath}/config`);
      
      // Validate genesis
      await execPromise(`${projectPath}/build/${network.chainId}d validate-genesis --home ${projectPath}/config`);
      
      return true;
    } catch (error) {
      console.error('Error adding genesis validators:', error);
      throw error;
    }
  }
  
  /**
   * Generate Docker and Kubernetes configuration files
   * @param {object} network - Network model instance
   * @param {string} projectPath - Path to project directory
   * @returns {Promise<void>}
   */
  async generateDeploymentConfig(network, projectPath) {
    try {
      console.log(`Generating deployment configuration for ${network.chainId}`);
      
      // Create Docker compose file
      await this.generateDockerCompose(network, projectPath);
      
      // Create Kubernetes manifests
      await kubernetes.generateManifests(network, projectPath);
      
      // Create Terraform files if needed
      if (network.provider !== 'custom') {
        await terraform.generateFiles(network, projectPath);
      }
      
      return true;
    } catch (error) {
      console.error('Error generating deployment configuration:', error);
      throw error;
    }
  }
  
  /**
   * Generate Docker Compose file
   * @param {object} network - Network model instance
   * @param {string} projectPath - Path to project directory
   * @returns {Promise<void>}
   */
  async generateDockerCompose(network, projectPath) {
    try {
      console.log(`Generating Docker Compose for ${network.chainId}`);
      
      // Load Docker Compose template
      const templatePath = path.join(this.templatesDir, 'docker-compose.yml.template');
      let template = await fs.readFile(templatePath, 'utf8');
      
      // Replace variables
      template = template
        .replace(/\${CHAIN_ID}/g, network.chainId)
        .replace(/\${TOKEN_SYMBOL}/g, network.tokenEconomics.symbol.toLowerCase())
        .replace(/\${VALIDATOR_COUNT}/g, network.validators?.count || 4);
      
      // Write Docker Compose file
      const outputPath = path.join(projectPath, 'docker-compose.yml');
      await fs.writeFile(outputPath, template);
      
      // Generate Dockerfile
      await this.generateDockerfile(network, projectPath);
      
      return true;
    } catch (error) {
      console.error('Error generating Docker Compose:', error);
      throw error;
    }
  }
  
  /**
   * Generate Dockerfile
   * @param {object} network - Network model instance
   * @param {string} projectPath - Path to project directory
   * @returns {Promise<void>}
   */
  async generateDockerfile(network, projectPath) {
    try {
      console.log(`Generating Dockerfile for ${network.chainId}`);
      
      // Load Dockerfile template
      const templatePath = path.join(this.templatesDir, 'Dockerfile.template');
      let template = await fs.readFile(templatePath, 'utf8');
      
      // Replace variables
      template = template
        .replace(/\${CHAIN_ID}/g, network.chainId);
      
      // Write Dockerfile
      const outputPath = path.join(projectPath, 'Dockerfile');
      await fs.writeFile(outputPath, template);
      
      return true;
    } catch (error) {
      console.error('Error generating Dockerfile:', error);
      throw error;
    }
  }
  
  /**
   * Deploy network using Docker
   * @param {object} network - Network model instance
   * @param {string} workspacePath - Path to deployment workspace
   * @returns {Promise<object>} - Deployment result
   */
  async deployWithDocker(network, workspacePath) {
    try {
      console.log(`Deploying ${network.chainId} with Docker`);
      
      const projectPath = path.join(workspacePath, network.chainId);
      
      // Build Docker image
      await execPromise(`docker build -t ${network.chainId}:latest .`, { cwd: projectPath });
      
      // Start with Docker Compose
      await execPromise(`docker-compose up -d`, { cwd: projectPath });
      
      // Get container IDs and IP addresses
      const { stdout } = await execPromise(`docker-compose ps -q`, { cwd: projectPath });
      const containerIds = stdout.trim().split('\n');
      
      const endpoints = [];
      for (const containerId of containerIds) {
        const { stdout: inspectOutput } = await execPromise(`docker inspect ${containerId}`);
        const inspectData = JSON.parse(inspectOutput);
        const ip = inspectData[0].NetworkSettings.Networks[`${network.chainId}_net`]?.IPAddress;
        const name = inspectData[0].Name.replace('/', '');
        
        if (ip) {
          endpoints.push({
            name,
            ip,
            rpcPort: 26657,
            rpcEndpoint: `http://${ip}:26657`,
            apiPort: 1317,
            apiEndpoint: `http://${ip}:1317`
          });
        }
      }
      
      return {
        deploymentType: 'docker',
        containerIds,
        endpoints,
        networkName: `${network.chainId}_net`
      };
    } catch (error) {
      console.error('Error deploying with Docker:', error);
      throw error;
    }
  }
  
  /**
   * Deploy network using Kubernetes
   * @param {object} network - Network model instance
   * @param {string} workspacePath - Path to deployment workspace
   * @returns {Promise<object>} - Deployment result
   */
  async deployWithKubernetes(network, workspacePath) {
    try {
      console.log(`Deploying ${network.chainId} with Kubernetes`);
      
      const projectPath = path.join(workspacePath, network.chainId);
      
      // First deploy infrastructure with Terraform if needed
      let infrastructureResult = {};
      if (network.provider !== 'custom') {
        infrastructureResult = await terraform.deploy(network, projectPath);
      }
      
      // Deploy to Kubernetes
      const kubernetesResult = await kubernetes.deploy(network, projectPath);
      
      return {
        deploymentType: 'kubernetes',
        provider: network.provider,
        region: network.region,
        infrastructure: infrastructureResult,
        kubernetes: kubernetesResult
      };
    } catch (error) {
      console.error('Error deploying with Kubernetes:', error);
      throw error;
    }
  }
}

// List of core modules that are included by default
const CORE_MODULES = ['bank', 'staking', 'distribution', 'gov', 'slashing'];

module.exports = new DeploymentService();