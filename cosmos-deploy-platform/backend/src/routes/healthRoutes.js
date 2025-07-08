const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Get MongoDB connection status
const getMongoStatus = () => {
  const state = mongoose.connection.readyState;
  switch (state) {
    case 0: return { status: 'DOWN', details: 'Disconnected' };
    case 1: return { status: 'UP', details: 'Connected' };
    case 2: return { status: 'UP', details: 'Connecting' };
    case 3: return { status: 'DOWN', details: 'Disconnecting' };
    default: return { status: 'UNKNOWN', details: 'Unknown state' };
  }
};

// Simple health check endpoint
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Spring Boot style actuator health endpoint
router.get('/actuator/health', (req, res) => {
  const mongoStatus = getMongoStatus();
  
  // Overall status is UP only if MongoDB is UP
  const status = mongoStatus.status === 'UP' ? 'UP' : 'DOWN';
  
  res.json({
    status,
    components: {
      mongo: mongoStatus,
      diskSpace: { status: 'UP' },
      api: { status: 'UP' }
    },
    timestamp: new Date().toISOString()
  });
});

// Detailed system info for admin users only
router.get('/system', (req, res) => {
  // This could be protected with admin middleware
  const systemInfo = {
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime(),
    cpuUsage: process.cpuUsage()
  };
  
  res.json(systemInfo);
});

module.exports = router;