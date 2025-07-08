const Network = require('../models/Network');

/**
 * @desc    Get all networks for the authenticated user
 * @route   GET /api/networks
 * @access  Private
 */
exports.getNetworks = async (req, res, next) => {
  try {
    // Get networks for the current user only
    const networks = await Network.find({ user: req.user.id });
    
    res.status(200).json({
      success: true,
      count: networks.length,
      data: networks
    });
  } catch (err) {
    console.error('Error fetching networks:', err);
    res.status(500).json({
      success: false,
      message: 'Server error fetching networks',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * @desc    Get a single network by ID
 * @route   GET /api/networks/:id
 * @access  Private
 */
exports.getNetwork = async (req, res, next) => {
  try {
    const network = await Network.findById(req.params.id);
    
    if (!network) {
      return res.status(404).json({
        success: false,
        message: 'Network not found'
      });
    }
    
    // Check if network belongs to the current user
    if (network.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this network'
      });
    }
    
    res.status(200).json({
      success: true,
      data: network
    });
  } catch (err) {
    console.error('Error fetching network:', err);
    res.status(500).json({
      success: false,
      message: 'Server error fetching network',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * @desc    Create a new network
 * @route   POST /api/networks
 * @access  Private
 */
exports.createNetwork = async (req, res, next) => {
  try {
    // Add user to request body
    req.body.user = req.user.id;
    
    // Create network
    const network = await Network.create(req.body);
    
    res.status(201).json({
      success: true,
      data: network
    });
  } catch (err) {
    console.error('Error creating network:', err);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error creating network',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * @desc    Update a network
 * @route   PUT /api/networks/:id
 * @access  Private
 */
exports.updateNetwork = async (req, res, next) => {
  try {
    let network = await Network.findById(req.params.id);
    
    if (!network) {
      return res.status(404).json({
        success: false,
        message: 'Network not found'
      });
    }
    
    // Check if network belongs to the current user
    if (network.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this network'
      });
    }
    
    // Update network
    network = await Network.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: network
    });
  } catch (err) {
    console.error('Error updating network:', err);
    res.status(500).json({
      success: false,
      message: 'Server error updating network',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * @desc    Delete a network
 * @route   DELETE /api/networks/:id
 * @access  Private
 */
exports.deleteNetwork = async (req, res, next) => {
  try {
    const network = await Network.findById(req.params.id);
    
    if (!network) {
      return res.status(404).json({
        success: false,
        message: 'Network not found'
      });
    }
    
    // Check if network belongs to the current user
    if (network.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this network'
      });
    }
    
    // Update status to Deleting
    network.status = 'Deleting';
    await network.save();
    
    // In a real app, trigger infrastructure deletion
    // Then actually delete the document once infrastructure is removed
    // For now, we'll just mark it as Deleting
    
    res.status(200).json({
      success: true,
      data: network
    });
  } catch (err) {
    console.error('Error deleting network:', err);
    res.status(500).json({
      success: false,
      message: 'Server error deleting network',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * @desc    Deploy a network
 * @route   POST /api/networks/:id/deploy
 * @access  Private
 */
exports.deployNetwork = async (req, res, next) => {
  try {
    const network = await Network.findById(req.params.id);
    
    if (!network) {
      return res.status(404).json({
        success: false,
        message: 'Network not found'
      });
    }
    
    // Check if network belongs to the current user
    if (network.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to deploy this network'
      });
    }
    
    // Check if network is in a deployable state
    if (network.status !== 'Created') {
      return res.status(400).json({
        success: false,
        message: `Network cannot be deployed in status: ${network.status}`
      });
    }
    
    // Update status to Deploying
    network.status = 'Deploying';
    network.deployedEnvironment = req.body.environment || 'production';
    await network.save();
    
    // In a real app, trigger infrastructure deployment
    // For now, simulate deployment with a timeout
    setTimeout(async () => {
      try {
        network.status = 'Active';
        await network.save();
        console.log(`Network ${network.name} deployed successfully`);
      } catch (err) {
        console.error(`Failed to update network ${network.name} status:`, err);
      }
    }, 30000); // 30 seconds
    
    res.status(200).json({
      success: true,
      data: network
    });
  } catch (err) {
    console.error('Error deploying network:', err);
    res.status(500).json({
      success: false,
      message: 'Server error deploying network',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * @desc    Backup a network
 * @route   POST /api/networks/:id/backup
 * @access  Private
 */
exports.backupNetwork = async (req, res, next) => {
  try {
    const network = await Network.findById(req.params.id);
    
    if (!network) {
      return res.status(404).json({
        success: false,
        message: 'Network not found'
      });
    }
    
    // Check if network belongs to the current user
    if (network.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to backup this network'
      });
    }
    
    // Check if network is in a state that can be backed up
    if (network.status !== 'Active' && network.status !== 'Degraded') {
      return res.status(400).json({
        success: false,
        message: `Network cannot be backed up in status: ${network.status}`
      });
    }
    
    // Update lastBackupAt timestamp
    network.lastBackupAt = new Date();
    await network.save();
    
    // In a real app, trigger backup process
    // For now, just generate a mock backup ID
    const backupId = `backup-${Date.now()}`;
    
    res.status(200).json({
      success: true,
      data: {
        backupId,
        timestamp: network.lastBackupAt,
        network: network._id
      }
    });
  } catch (err) {
    console.error('Error backing up network:', err);
    res.status(500).json({
      success: false,
      message: 'Server error backing up network',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * @desc    Restore a network from backup
 * @route   POST /api/networks/:id/restore/:backupId
 * @access  Private
 */
exports.restoreNetwork = async (req, res, next) => {
  try {
    const network = await Network.findById(req.params.id);
    
    if (!network) {
      return res.status(404).json({
        success: false,
        message: 'Network not found'
      });
    }
    
    // Check if network belongs to the current user
    if (network.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to restore this network'
      });
    }
    
    // Check if network is in a state that can be restored
    if (network.status !== 'Active' && network.status !== 'Degraded' && network.status !== 'Failed') {
      return res.status(400).json({
        success: false,
        message: `Network cannot be restored in status: ${network.status}`
      });
    }
    
    // Validate backup ID
    const backupId = req.params.backupId;
    if (!backupId) {
      return res.status(400).json({
        success: false,
        message: 'Backup ID is required'
      });
    }
    
    // In a real app, check if the backup exists
    // For now, assume it exists
    
    // Update status to indicate restoration
    network.status = 'Restoring';
    await network.save();
    
    // In a real app, trigger restore process
    // For now, simulate restoration with a timeout
    setTimeout(async () => {
      try {
        network.status = 'Active';
        await network.save();
        console.log(`Network ${network.name} restored successfully from backup ${backupId}`);
      } catch (err) {
        console.error(`Failed to update network ${network.name} status after restore:`, err);
      }
    }, 30000); // 30 seconds
    
    res.status(200).json({
      success: true,
      data: {
        message: `Network restoration from backup ${backupId} initiated`,
        network
      }
    });
  } catch (err) {
    console.error('Error restoring network:', err);
    res.status(500).json({
      success: false,
      message: 'Server error restoring network',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};