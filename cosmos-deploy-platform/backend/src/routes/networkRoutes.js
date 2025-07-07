/**
 * Network Routes
 * 
 * API endpoints for network management operations
 */

const express = require('express');
const networkController = require('../controllers/networkController');
const auth = require('../middlewares/auth');

const router = express.Router();

/**
 * @route   GET /api/networks
 * @desc    Get all networks for the authenticated user
 * @access  Private
 */
router.get('/', auth, networkController.getAllNetworks);

/**
 * @route   POST /api/networks
 * @desc    Create a new network
 * @access  Private
 */
router.post('/', auth, networkController.createNetwork);

/**
 * @route   GET /api/networks/:id
 * @desc    Get a specific network by ID
 * @access  Private
 */
router.get('/:id', auth, networkController.getNetworkById);

/**
 * @route   PUT /api/networks/:id
 * @desc    Update a network
 * @access  Private
 */
router.put('/:id', auth, networkController.updateNetwork);

/**
 * @route   DELETE /api/networks/:id
 * @desc    Delete a network
 * @access  Private
 */
router.delete('/:id', auth, networkController.deleteNetwork);

/**
 * @route   POST /api/networks/:id/deploy
 * @desc    Deploy a network to an environment
 * @access  Private
 */
router.post('/:id/deploy', auth, networkController.deployNetwork);

/**
 * @route   GET /api/networks/:id/status
 * @desc    Get the deployment status of a network
 * @access  Private
 */
router.get('/:id/status', auth, networkController.getNetworkStatus);

/**
 * @route   GET /api/networks/:id/metrics
 * @desc    Get metrics for a network
 * @access  Private
 */
router.get('/:id/metrics', auth, networkController.getNetworkMetrics);

/**
 * @route   GET /api/networks/:id/validators
 * @desc    Get validators for a network
 * @access  Private
 */
router.get('/:id/validators', auth, networkController.getNetworkValidators);

/**
 * @route   POST /api/networks/:id/validators
 * @desc    Add a validator to a network
 * @access  Private
 */
router.post('/:id/validators', auth, networkController.addValidator);

/**
 * @route   PUT /api/networks/:id/validators/:validatorId
 * @desc    Update a validator
 * @access  Private
 */
router.put('/:id/validators/:validatorId', auth, networkController.updateValidator);

/**
 * @route   DELETE /api/networks/:id/validators/:validatorId
 * @desc    Remove a validator from a network
 * @access  Private
 */
router.delete('/:id/validators/:validatorId', auth, networkController.removeValidator);

/**
 * @route   POST /api/networks/:id/backup
 * @desc    Create a backup of a network
 * @access  Private
 */
router.post('/:id/backup', auth, networkController.createBackup);

/**
 * @route   GET /api/networks/:id/backups
 * @desc    Get all backups for a network
 * @access  Private
 */
router.get('/:id/backups', auth, networkController.getBackups);

/**
 * @route   POST /api/networks/:id/restore/:backupId
 * @desc    Restore a network from a backup
 * @access  Private
 */
router.post('/:id/restore/:backupId', auth, networkController.restoreBackup);

/**
 * @route   GET /api/networks/:id/logs
 * @desc    Get logs for a network
 * @access  Private
 */
router.get('/:id/logs', auth, networkController.getNetworkLogs);

/**
 * @route   GET /api/networks/:id/config
 * @desc    Get the configuration for a network
 * @access  Private
 */
router.get('/:id/config', auth, networkController.getNetworkConfig);

/**
 * @route   PUT /api/networks/:id/config
 * @desc    Update the configuration for a network
 * @access  Private
 */
router.put('/:id/config', auth, networkController.updateNetworkConfig);

module.exports = router;