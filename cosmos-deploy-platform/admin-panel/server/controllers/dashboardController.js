const User = require('../models/User');
const Network = require('../models/Network');
const SystemLog = require('../models/SystemLog');
const { checkDBConnection } = require('../utils/db');
const os = require('os');

// Get dashboard data
exports.getDashboardData = async (req, res) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    
    // Get users by role
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    
    // Network statistics
    const totalNetworks = await Network.countDocuments();
    
    // Networks by status
    const networksByStatus = await Network.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Networks by deployment type
    const networksByDeployment = await Network.aggregate([
      { $group: { _id: '$deploymentType', count: { $sum: 1 } } }
    ]);
    
    // Recent networks
    const recentNetworks = await Network.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('owner', 'name email');
    
    // System logs - recent errors
    const recentErrors = await SystemLog.find({
      level: { $in: ['error', 'critical'] },
      resolved: false
    })
      .sort({ timestamp: -1 })
      .limit(5)
      .populate('userId', 'name email')
      .populate('networkId', 'name chainId');
    
    // System logs - all recent logs
    const recentLogs = await SystemLog.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('userId', 'name email')
      .populate('networkId', 'name chainId');
    
    // System health
    const dbStatus = checkDBConnection();
    const memoryUsage = {
      total: os.totalmem(),
      free: os.freemem(),
      used: os.totalmem() - os.freemem(),
      percentage: Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100)
    };
    
    // Recent user activity
    const recentActivity = await User.find({ lastLogin: { $ne: null } })
      .sort({ lastLogin: -1 })
      .limit(5)
      .select('name email lastLogin');
    
    // Validator statistics
    const validatorStats = await Network.aggregate([
      { $unwind: '$validators' },
      { $group: { 
        _id: '$validators.status', 
        count: { $sum: 1 },
        totalPower: { $sum: '$validators.power' }
      }}
    ]);
    
    // Get recent deployments (active networks in the last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentDeployments = await Network.find({
      deployedAt: { $gte: oneWeekAgo }
    })
      .sort({ deployedAt: -1 })
      .limit(5)
      .populate('owner', 'name email');
    
    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: totalUsers - activeUsers,
          byRole: usersByRole.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
          }, {})
        },
        networks: {
          total: totalNetworks,
          byStatus: networksByStatus.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
          }, {}),
          byDeployment: networksByDeployment.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
          }, {}),
          recent: recentNetworks,
          recentDeployments
        },
        system: {
          database: dbStatus,
          memory: memoryUsage,
          uptime: os.uptime(),
          platform: os.platform(),
          hostname: os.hostname()
        },
        validators: validatorStats.reduce((acc, curr) => {
          acc[curr._id] = { count: curr.count, totalPower: curr.totalPower };
          return acc;
        }, {}),
        logs: {
          recentErrors,
          recentLogs
        },
        activity: recentActivity
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get quick stats for admin panel header
exports.getQuickStats = async (req, res) => {
  try {
    // Get total users
    const totalUsers = await User.countDocuments();
    
    // Get total networks
    const totalNetworks = await Network.countDocuments();
    
    // Get active networks
    const activeNetworks = await Network.countDocuments({ status: 'active' });
    
    // Get unresolved errors
    const unresolvedErrors = await SystemLog.countDocuments({
      level: { $in: ['error', 'critical'] },
      resolved: false
    });
    
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalNetworks,
        activeNetworks,
        unresolvedErrors
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get activity feed
exports.getActivityFeed = async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    
    const skip = (page - 1) * limit;
    
    // Get system logs for activity feed
    const logs = await SystemLog.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'name email')
      .populate('networkId', 'name chainId')
      .populate('resolvedBy', 'name email');
    
    const total = await SystemLog.countDocuments();
    
    res.status(200).json({
      success: true,
      data: {
        logs,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};