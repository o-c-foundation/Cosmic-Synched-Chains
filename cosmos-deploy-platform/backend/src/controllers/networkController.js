/**
 * Network Controller
 * 
 * Handles API requests related to blockchain network management
 */

const Network = require('../models/Network');
const User = require('../models/User');
const deployService = require('../services/deployService');
const monitoringService = require('../services/monitoringService');
const validatorService = require('../services/validatorService');
const backupService = require('../services/backupService');
const logsService = require('../services/logsService');
const { ResourceNotFoundError, ValidationError, NetworkDeploymentError } = require('../middlewares/errorHandler');

/**
 * Get all networks for the authenticated user
 * @route GET /api/networks
 * @access Private
 */
exports.getAllNetworks = async (req, res, next) => {
  try {
    // Get networks where user is owner or collaborator
    const networks = await Network.find({
      $or: [
        { owner: req.user._id },
        { 'collaborators.user': req.user._id }
      ]
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: networks.length,
      data: networks
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new network
 * @route POST /api/networks
 * @access Private
 */
exports.createNetwork = async (req, res, next) => {
  try {
    // Add user as owner
    req.body.owner = req.user._id;
    
    // Validate chain ID is unique
    const existingNetwork = await Network.findOne({ chainId: req.body.chainId });
    if (existingNetwork) {
      throw new ValidationError(`Chain ID '${req.body.chainId}' is already in use`);
    }
    
    // Create network
    const network = await Network.create(req.body);
    
    res.status(201).json({
      success: true,
      data: network
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific network by ID
 * @route GET /api/networks/:id
 * @access Private
 */
exports.getNetworkById = async (req, res, next) => {
  try {
    const network = await Network.findById(req.params.id);
    
    if (!network) {
      throw new ResourceNotFoundError('Network', `Network not found with id ${req.params.id}`);
    }
    
    // Check ownership or collaboration
    if (network.owner.toString() !== req.user._id.toString() && 
        !network.collaborators.some(c => c.user.toString() === req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this network'
      });
    }
    
    res.status(200).json({
      success: true,
      data: network
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a network
 * @route PUT /api/networks/:id
 * @access Private
 */
exports.updateNetwork = async (req, res, next) => {
  try {
    let network = await Network.findById(req.params.id);
    
    if (!network) {
      throw new ResourceNotFoundError('Network', `Network not found with id ${req.params.id}`);
    }
    
    // Check ownership or admin collaboration
    if (network.owner.toString() !== req.user._id.toString() && 
        !network.collaborators.some(c => c.user.toString() === req.user._id.toString() && c.role === 'admin')) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this network'
      });
    }
    
    // Don't allow changing the chain ID if network is deployed
    if (req.body.chainId && req.body.chainId !== network.chainId && network.status !== 'Created') {
      throw new ValidationError('Cannot change chain ID after network has been deployed');
    }
    
    // Update network
    network = await Network.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: network
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a network
 * @route DELETE /api/networks/:id
 * @access Private
 */
exports.deleteNetwork = async (req, res, next) => {
  try {
    const network = await Network.findById(req.params.id);
    
    if (!network) {
      throw new ResourceNotFoundError('Network', `Network not found with id ${req.params.id}`);
    }
    
    // Check ownership
    if (network.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this network'
      });
    }
    
    // If network is deployed, terminate first
    if (network.status === 'Active' || network.status === 'Deploying') {
      await deployService.terminateNetwork(network);
    }
    
    await network.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deploy a network to an environment
 * @route POST /api/networks/:id/deploy
 * @access Private
 */
exports.deployNetwork = async (req, res, next) => {
  try {
    const { environment } = req.body;
    
    if (!environment) {
      throw new ValidationError('Environment is required');
    }
    
    const network = await Network.findById(req.params.id);
    
    if (!network) {
      throw new ResourceNotFoundError('Network', `Network not found with id ${req.params.id}`);
    }
    
    // Check ownership or admin collaboration
    if (network.owner.toString() !== req.user._id.toString() && 
        !network.collaborators.some(c => c.user.toString() === req.user._id.toString() && c.role === 'admin')) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to deploy this network'
      });
    }
    
    // Check if network is already being deployed
    if (network.status === 'Deploying') {
      throw new ValidationError('Network is already being deployed');
    }
    
    // Trigger deployment in the background
    deployService.deployNetwork(network, environment);
    
    // Update network status
    network.status = 'Deploying';
    await network.save();
    
    res.status(202).json({
      success: true,
      data: network,
      message: `Network deployment to ${environment} initiated`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get the deployment status of a network
 * @route GET /api/networks/:id/status
 * @access Private
 */
exports.getNetworkStatus = async (req, res, next) => {
  try {
    const network = await Network.findById(req.params.id);
    
    if (!network) {
      throw new ResourceNotFoundError('Network', `Network not found with id ${req.params.id}`);
    }
    
    // Check ownership or collaboration
    if (network.owner.toString() !== req.user._id.toString() && 
        !network.collaborators.some(c => c.user.toString() === req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this network'
      });
    }
    
    // Get detailed status from deployment service
    const deploymentStatus = await deployService.getNetworkStatus(network);
    
    res.status(200).json({
      success: true,
      data: {
        status: network.status,
        deploymentStatus
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get metrics for a network
 * @route GET /api/networks/:id/metrics
 * @access Private
 */
exports.getNetworkMetrics = async (req, res, next) => {
  try {
    const network = await Network.findById(req.params.id);
    
    if (!network) {
      throw new ResourceNotFoundError('Network', `Network not found with id ${req.params.id}`);
    }
    
    // Check ownership or collaboration
    if (network.owner.toString() !== req.user._id.toString() && 
        !network.collaborators.some(c => c.user.toString() === req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this network'
      });
    }
    
    // Only get metrics if network is active
    if (network.status !== 'Active') {
      throw new ValidationError('Cannot get metrics for a network that is not active');
    }
    
    // Get metrics from monitoring service
    const metrics = await monitoringService.getNetworkMetrics(network);
    
    res.status(200).json({
      success: true,
      data: metrics
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get validators for a network
 * @route GET /api/networks/:id/validators
 * @access Private
 */
exports.getNetworkValidators = async (req, res, next) => {
  try {
    const network = await Network.findById(req.params.id);
    
    if (!network) {
      throw new ResourceNotFoundError('Network', `Network not found with id ${req.params.id}`);
    }
    
    // Check ownership or collaboration
    if (network.owner.toString() !== req.user._id.toString() && 
        !network.collaborators.some(c => c.user.toString() === req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this network'
      });
    }
    
    // Get validators from validator service
    const validators = await validatorService.getNetworkValidators(network);
    
    res.status(200).json({
      success: true,
      data: validators
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add a validator to a network
 * @route POST /api/networks/:id/validators
 * @access Private
 */
exports.addValidator = async (req, res, next) => {
  try {
    const network = await Network.findById(req.params.id);
    
    if (!network) {
      throw new ResourceNotFoundError('Network', `Network not found with id ${req.params.id}`);
    }
    
    // Check ownership or admin collaboration
    if (network.owner.toString() !== req.user._id.toString() && 
        !network.collaborators.some(c => c.user.toString() === req.user._id.toString() && c.role === 'admin')) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to modify this network'
      });
    }
    
    // Only add validator if network is active
    if (network.status !== 'Active') {
      throw new ValidationError('Cannot add validator to a network that is not active');
    }
    
    // Add validator through validator service
    const validator = await validatorService.addValidator(network, req.body);
    
    res.status(201).json({
      success: true,
      data: validator
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a validator
 * @route PUT /api/networks/:id/validators/:validatorId
 * @access Private
 */
exports.updateValidator = async (req, res, next) => {
  try {
    const network = await Network.findById(req.params.id);
    
    if (!network) {
      throw new ResourceNotFoundError('Network', `Network not found with id ${req.params.id}`);
    }
    
    // Check ownership or admin collaboration
    if (network.owner.toString() !== req.user._id.toString() && 
        !network.collaborators.some(c => c.user.toString() === req.user._id.toString() && c.role === 'admin')) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to modify this network'
      });
    }
    
    // Only update validator if network is active
    if (network.status !== 'Active') {
      throw new ValidationError('Cannot update validator for a network that is not active');
    }
    
    // Update validator through validator service
    const validator = await validatorService.updateValidator(
      network, 
      req.params.validatorId, 
      req.body
    );
    
    res.status(200).json({
      success: true,
      data: validator
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove a validator from a network
 * @route DELETE /api/networks/:id/validators/:validatorId
 * @access Private
 */
exports.removeValidator = async (req, res, next) => {
  try {
    const network = await Network.findById(req.params.id);
    
    if (!network) {
      throw new ResourceNotFoundError('Network', `Network not found with id ${req.params.id}`);
    }
    
    // Check ownership or admin collaboration
    if (network.owner.toString() !== req.user._id.toString() && 
        !network.collaborators.some(c => c.user.toString() === req.user._id.toString() && c.role === 'admin')) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to modify this network'
      });
    }
    
    // Only remove validator if network is active
    if (network.status !== 'Active') {
      throw new ValidationError('Cannot remove validator from a network that is not active');
    }
    
    // Remove validator through validator service
    await validatorService.removeValidator(network, req.params.validatorId);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a backup of a network
 * @route POST /api/networks/:id/backup
 * @access Private
 */
exports.createBackup = async (req, res, next) => {
  try {
    const network = await Network.findById(req.params.id);
    
    if (!network) {
      throw new ResourceNotFoundError('Network', `Network not found with id ${req.params.id}`);
    }
    
    // Check ownership or admin collaboration
    if (network.owner.toString() !== req.user._id.toString() && 
        !network.collaborators.some(c => c.user.toString() === req.user._id.toString() && c.role === 'admin')) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to backup this network'
      });
    }
    
    // Only backup active networks
    if (network.status !== 'Active') {
      throw new ValidationError('Cannot backup a network that is not active');
    }
    
    // Create backup through backup service
    const backup = await backupService.createBackup(network, req.body.description);
    
    // Update network with backup info
    network.backups.push(backup);
    network.lastBackupAt = new Date();
    await network.save();
    
    res.status(201).json({
      success: true,
      data: backup
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all backups for a network
 * @route GET /api/networks/:id/backups
 * @access Private
 */
exports.getBackups = async (req, res, next) => {
  try {
    const network = await Network.findById(req.params.id);
    
    if (!network) {
      throw new ResourceNotFoundError('Network', `Network not found with id ${req.params.id}`);
    }
    
    // Check ownership or collaboration
    if (network.owner.toString() !== req.user._id.toString() && 
        !network.collaborators.some(c => c.user.toString() === req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this network'
      });
    }
    
    res.status(200).json({
      success: true,
      count: network.backups.length,
      data: network.backups
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Restore a network from a backup
 * @route POST /api/networks/:id/restore/:backupId
 * @access Private
 */
exports.restoreBackup = async (req, res, next) => {
  try {
    const network = await Network.findById(req.params.id);
    
    if (!network) {
      throw new ResourceNotFoundError('Network', `Network not found with id ${req.params.id}`);
    }
    
    // Check ownership or admin collaboration
    if (network.owner.toString() !== req.user._id.toString() && 
        !network.collaborators.some(c => c.user.toString() === req.user._id.toString() && c.role === 'admin')) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to restore this network'
      });
    }
    
    // Find the backup
    const backup = network.backups.find(b => b.backupId === req.params.backupId);
    
    if (!backup) {
      throw new ResourceNotFoundError('Backup', `Backup not found with id ${req.params.backupId}`);
    }
    
    // Update network status
    network.status = 'Restoring';
    await network.save();
    
    // Restore backup through backup service
    backupService.restoreBackup(network, req.params.backupId);
    
    res.status(202).json({
      success: true,
      message: 'Network restore initiated',
      data: {
        network,
        backup
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get logs for a network
 * @route GET /api/networks/:id/logs
 * @access Private
 */
exports.getNetworkLogs = async (req, res, next) => {
  try {
    const network = await Network.findById(req.params.id);
    
    if (!network) {
      throw new ResourceNotFoundError('Network', `Network not found with id ${req.params.id}`);
    }
    
    // Check ownership or collaboration
    if (network.owner.toString() !== req.user._id.toString() && 
        !network.collaborators.some(c => c.user.toString() === req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this network'
      });
    }
    
    // Query parameters for filtering logs
    const { level, limit, from, to, service } = req.query;
    
    // Get logs through logs service
    const logs = await logsService.getNetworkLogs(network, {
      level,
      limit: limit ? parseInt(limit, 10) : 100,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
      service
    });
    
    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get the configuration for a network
 * @route GET /api/networks/:id/config
 * @access Private
 */
exports.getNetworkConfig = async (req, res, next) => {
  try {
    const network = await Network.findById(req.params.id);
    
    if (!network) {
      throw new ResourceNotFoundError('Network', `Network not found with id ${req.params.id}`);
    }
    
    // Check ownership or collaboration
    if (network.owner.toString() !== req.user._id.toString() && 
        !network.collaborators.some(c => c.user.toString() === req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this network'
      });
    }
    
    // Format the configuration data
    const config = {
      chainId: network.chainId,
      tokenEconomics: network.tokenEconomics,
      validatorRequirements: network.validatorRequirements,
      governanceSettings: network.governanceSettings,
      modules: network.modules,
      activeDeployment: network.activeDeployment
    };
    
    res.status(200).json({
      success: true,
      data: config
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update the configuration for a network
 * @route PUT /api/networks/:id/config
 * @access Private
 */
exports.updateNetworkConfig = async (req, res, next) => {
  try {
    let network = await Network.findById(req.params.id);
    
    if (!network) {
      throw new ResourceNotFoundError('Network', `Network not found with id ${req.params.id}`);
    }
    
    // Check ownership or admin collaboration
    if (network.owner.toString() !== req.user._id.toString() && 
        !network.collaborators.some(c => c.user.toString() === req.user._id.toString() && c.role === 'admin')) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this network'
      });
    }
    
    // Allow updating only if network is not deploying or restoring
    if (network.status === 'Deploying' || network.status === 'Restoring') {
      throw new ValidationError(`Cannot update configuration while network is in ${network.status} state`);
    }
    
    // Prepare the update object
    const updateData = {};
    
    // Only allow updating specific config sections
    if (req.body.tokenEconomics) updateData.tokenEconomics = req.body.tokenEconomics;
    if (req.body.validatorRequirements) updateData.validatorRequirements = req.body.validatorRequirements;
    if (req.body.governanceSettings) updateData.governanceSettings = req.body.governanceSettings;
    if (req.body.modules) updateData.modules = req.body.modules;
    
    // Update network
    network = await Network.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    // If network is active, apply changes to the running network
    if (network.status === 'Active') {
      network.status = 'Updating';
      await network.save();
      
      // Apply changes in the background
      deployService.updateNetworkConfig(network);
    }
    
    res.status(200).json({
      success: true,
      data: network
    });
  } catch (error) {
    next(error);
  }
};