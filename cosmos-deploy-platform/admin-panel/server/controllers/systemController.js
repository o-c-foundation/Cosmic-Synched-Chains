const SystemLog = require('../models/SystemLog');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const os = require('os');
const { checkDBConnection } = require('../utils/db');

// Get system logs
exports.getLogs = async (req, res) => {
  try {
    const { level, source, limit = 100, page = 1, resolved } = req.query;
    
    const query = {};
    
    if (level) {
      query.level = level;
    }
    
    if (source) {
      query.source = source;
    }
    
    if (resolved !== undefined) {
      query.resolved = resolved === 'true';
    }
    
    const skip = (page - 1) * limit;
    
    const logs = await SystemLog.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'name email')
      .populate('networkId', 'name chainId');
    
    const total = await SystemLog.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: logs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: logs
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create system log
exports.createLog = async (req, res) => {
  try {
    const { level, source, message, details, userId, networkId } = req.body;
    
    if (!level || !source || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please provide level, source, and message'
      });
    }
    
    const log = await SystemLog.create({
      level,
      source,
      message,
      details: details || null,
      userId: userId || null,
      networkId: networkId || null
    });
    
    res.status(201).json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Resolve system log
exports.resolveLog = async (req, res) => {
  try {
    const { userId, action } = req.body;
    
    const log = await SystemLog.findById(req.params.id);
    
    if (!log) {
      return res.status(404).json({ success: false, error: 'Log not found' });
    }
    
    log.resolved = true;
    log.resolvedBy = userId;
    log.resolvedAt = Date.now();
    
    if (action) {
      log.actions.push({
        action,
        timestamp: Date.now(),
        userId,
        result: 'Log marked as resolved'
      });
    }
    
    await log.save();
    
    res.status(200).json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get system status
exports.getSystemStatus = async (req, res) => {
  try {
    // Get system information
    const cpuCount = os.cpus().length;
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsagePercent = Math.round((usedMemory / totalMemory) * 100);
    const uptime = os.uptime();
    
    // Check database connection
    const dbStatus = checkDBConnection();
    
    // Check services status
    let frontendStatus, backendStatus;
    try {
      const { stdout: frontendOut } = await execPromise('pgrep -f "npm run start" | wc -l');
      frontendStatus = parseInt(frontendOut.trim()) > 0 ? 'running' : 'stopped';
    } catch (error) {
      frontendStatus = 'unknown';
    }
    
    try {
      const { stdout: backendOut } = await execPromise('pgrep -f "node.*server\\.js" | wc -l');
      backendStatus = parseInt(backendOut.trim()) > 0 ? 'running' : 'stopped';
    } catch (error) {
      backendStatus = 'unknown';
    }
    
    // Get disk usage
    let diskUsage;
    try {
      const { stdout } = await execPromise('df -h / | tail -1');
      const parts = stdout.trim().split(/\s+/);
      diskUsage = {
        filesystem: parts[0],
        size: parts[1],
        used: parts[2],
        available: parts[3],
        usePercentage: parts[4],
        mountedOn: parts[5]
      };
    } catch (error) {
      diskUsage = { error: error.message };
    }
    
    // Count error logs in the last 24 hours
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    const recentErrorCount = await SystemLog.countDocuments({
      level: { $in: ['error', 'critical'] },
      timestamp: { $gte: oneDayAgo }
    });
    
    res.status(200).json({
      success: true,
      data: {
        system: {
          cpu: {
            count: cpuCount,
            model: os.cpus()[0].model,
            architecture: os.arch()
          },
          memory: {
            total: Math.round(totalMemory / (1024 * 1024 * 1024) * 100) / 100 + ' GB',
            free: Math.round(freeMemory / (1024 * 1024 * 1024) * 100) / 100 + ' GB',
            used: Math.round(usedMemory / (1024 * 1024 * 1024) * 100) / 100 + ' GB',
            usagePercent: memoryUsagePercent
          },
          uptime: {
            seconds: uptime,
            formatted: formatUptime(uptime)
          },
          platform: os.platform(),
          hostname: os.hostname(),
          disk: diskUsage
        },
        services: {
          database: dbStatus,
          frontend: frontendStatus,
          backend: backendStatus
        },
        alerts: {
          recentErrorCount
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Restart service
exports.restartService = async (req, res) => {
  try {
    const { service } = req.params;
    
    if (!['frontend', 'backend', 'all'].includes(service)) {
      return res.status(400).json({ success: false, error: 'Invalid service' });
    }
    
    let command;
    let result;
    
    if (service === 'frontend' || service === 'all') {
      // First kill any existing processes
      await execPromise('pkill -f "npm run start" || true');
      
      // Start frontend in background
      if (service === 'frontend') {
        command = 'cd /root/Documents/cosmos-deploy-platform/frontend && npm run start > frontend.log 2>&1 &';
        result = await execPromise(command);
      }
    }
    
    if (service === 'backend' || service === 'all') {
      // First kill any existing processes
      await execPromise('pkill -f "node.*server\\.js" || true');
      
      // Start backend in background
      if (service === 'backend') {
        command = 'cd /root/Documents/cosmos-deploy-platform/backend && node src/server.js > backend.log 2>&1 &';
        result = await execPromise(command);
      }
    }
    
    if (service === 'all') {
      // Start all services
      await execPromise('cd /root/Documents/cosmos-deploy-platform/frontend && npm run start > frontend.log 2>&1 &');
      await execPromise('cd /root/Documents/cosmos-deploy-platform/backend && node src/server.js > backend.log 2>&1 &');
      result = { stdout: 'All services restarted' };
    }
    
    // Log the restart action
    await SystemLog.create({
      level: 'info',
      source: 'admin-panel',
      message: `Service ${service} restarted`,
      details: { result }
    });
    
    res.status(200).json({
      success: true,
      message: `${service} service(s) restarted successfully`,
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Helper function to format uptime
function formatUptime(uptime) {
  const days = Math.floor(uptime / (24 * 60 * 60));
  const hours = Math.floor((uptime % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((uptime % (60 * 60)) / 60);
  const seconds = Math.floor(uptime % 60);
  
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}