const Network = require('../models/Network');
const User = require('../models/User');
const SystemLog = require('../models/SystemLog');

// Get all networks
exports.getNetworks = async (req, res) => {
  try {
    const networks = await Network.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
      
    res.status(200).json({ success: true, count: networks.length, data: networks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get single network
exports.getNetwork = async (req, res) => {
  try {
    const network = await Network.findById(req.params.id)
      .populate('owner', 'name email');
    
    if (!network) {
      return res.status(404).json({ success: false, error: 'Network not found' });
    }
    
    res.status(200).json({ success: true, data: network });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create network
exports.createNetwork = async (req, res) => {
  try {
    const { name, chainId, description, owner, nodeCount, deploymentType } = req.body;
    
    // Verify owner exists
    const user = await User.findById(owner);
    if (!user) {
      return res.status(400).json({ success: false, error: 'Owner user not found' });
    }
    
    // Check if chainId already exists
    const existingNetwork = await Network.findOne({ chainId });
    if (existingNetwork) {
      return res.status(400).json({ success: false, error: 'Chain ID already in use' });
    }
    
    const network = await Network.create({
      name,
      chainId,
      description: description || '',
      owner,
      nodeCount: nodeCount || 1,
      deploymentType: deploymentType || 'testnet',
      status: 'planned'
    });
    
    // Log network creation
    await SystemLog.create({
      level: 'info',
      source: 'admin-panel',
      message: `Network ${name} (${chainId}) created`,
      userId: null, // Admin user ID would go here
      networkId: network._id
    });
    
    res.status(201).json({ success: true, data: network });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update network
exports.updateNetwork = async (req, res) => {
  try {
    const { name, description, status, nodeCount, deploymentType } = req.body;
    
    let network = await Network.findById(req.params.id);
    
    if (!network) {
      return res.status(404).json({ success: false, error: 'Network not found' });
    }
    
    // Update fields
    network.name = name || network.name;
    network.description = description !== undefined ? description : network.description;
    network.status = status || network.status;
    network.nodeCount = nodeCount || network.nodeCount;
    network.deploymentType = deploymentType || network.deploymentType;
    network.updatedAt = Date.now();
    
    await network.save();
    
    // Log network update
    await SystemLog.create({
      level: 'info',
      source: 'admin-panel',
      message: `Network ${network.name} (${network.chainId}) updated`,
      networkId: network._id
    });
    
    res.status(200).json({ success: true, data: network });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete network
exports.deleteNetwork = async (req, res) => {
  try {
    const network = await Network.findById(req.params.id);
    
    if (!network) {
      return res.status(404).json({ success: false, error: 'Network not found' });
    }
    
    // Store network info before deletion for logging
    const { name, chainId, _id } = network;
    
    await network.deleteOne();
    
    // Log network deletion
    await SystemLog.create({
      level: 'warning',
      source: 'admin-panel',
      message: `Network ${name} (${chainId}) deleted`,
      details: { networkId: _id.toString() }
    });
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update network status
exports.updateNetworkStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ success: false, error: 'Please provide a status' });
    }
    
    const validStatuses = ['planned', 'deploying', 'active', 'error', 'stopped', 'terminated'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }
    
    const network = await Network.findById(req.params.id);
    
    if (!network) {
      return res.status(404).json({ success: false, error: 'Network not found' });
    }
    
    const previousStatus = network.status;
    network.status = status;
    
    // Set deployment date if network becomes active
    if (status === 'active' && previousStatus !== 'active') {
      network.deployedAt = Date.now();
      network.lastActiveAt = Date.now();
    }
    
    // Update lastActiveAt if network is being reactivated
    if (status === 'active' && previousStatus === 'stopped') {
      network.lastActiveAt = Date.now();
    }
    
    await network.save();
    
    // Log network status change
    await SystemLog.create({
      level: status === 'error' ? 'error' : 'info',
      source: 'admin-panel',
      message: `Network ${network.name} (${network.chainId}) status changed from ${previousStatus} to ${status}`,
      networkId: network._id
    });
    
    res.status(200).json({ success: true, data: network });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add/update validator to network
exports.manageValidator = async (req, res) => {
  try {
    const { validatorId, name, power, address, pubKey, status } = req.body;
    
    const network = await Network.findById(req.params.id);
    
    if (!network) {
      return res.status(404).json({ success: false, error: 'Network not found' });
    }
    
    // If validatorId is provided, update existing validator
    if (validatorId) {
      const validatorIndex = network.validators.findIndex(v => v._id.toString() === validatorId);
      
      if (validatorIndex === -1) {
        return res.status(404).json({ success: false, error: 'Validator not found' });
      }
      
      network.validators[validatorIndex] = {
        ...network.validators[validatorIndex],
        name: name || network.validators[validatorIndex].name,
        power: power || network.validators[validatorIndex].power,
        address: address || network.validators[validatorIndex].address,
        pubKey: pubKey || network.validators[validatorIndex].pubKey,
        status: status || network.validators[validatorIndex].status
      };
      
      await network.save();
      
      res.status(200).json({ success: true, data: network.validators[validatorIndex] });
    } else {
      // Add new validator
      if (!name || !power) {
        return res.status(400).json({ success: false, error: 'Validator name and power are required' });
      }
      
      const newValidator = {
        name,
        power,
        address: address || '',
        pubKey: pubKey || '',
        status: status || 'active'
      };
      
      network.validators.push(newValidator);
      await network.save();
      
      res.status(201).json({ success: true, data: newValidator });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Remove validator from network
exports.removeValidator = async (req, res) => {
  try {
    const { validatorId } = req.params;
    
    const network = await Network.findById(req.params.id);
    
    if (!network) {
      return res.status(404).json({ success: false, error: 'Network not found' });
    }
    
    const validatorIndex = network.validators.findIndex(v => v._id.toString() === validatorId);
    
    if (validatorIndex === -1) {
      return res.status(404).json({ success: false, error: 'Validator not found' });
    }
    
    // Remove validator
    network.validators.splice(validatorIndex, 1);
    await network.save();
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get network statistics
exports.getNetworkStats = async (req, res) => {
  try {
    // Count networks by status
    const statusCounts = await Network.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Count networks by deployment type
    const deploymentCounts = await Network.aggregate([
      { $group: { _id: '$deploymentType', count: { $sum: 1 } } }
    ]);
    
    // Get recent networks
    const recentNetworks = await Network.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('owner', 'name email');
    
    // Count total networks
    const totalNetworks = await Network.countDocuments();
    
    // Count active validators
    const activeValidators = await Network.aggregate([
      { $unwind: '$validators' },
      { $match: { 'validators.status': 'active' } },
      { $count: 'total' }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        total: totalNetworks,
        byStatus: statusCounts.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        byDeploymentType: deploymentCounts.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        activeValidators: activeValidators.length > 0 ? activeValidators[0].total : 0,
        recentNetworks
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};