const express = require('express');
const router = express.Router();
const systemController = require('../controllers/systemController');

// GET /api/system/logs - Get system logs
router.get('/logs', systemController.getLogs);

// POST /api/system/logs - Create system log
router.post('/logs', systemController.createLog);

// PUT /api/system/logs/:id/resolve - Resolve system log
router.put('/logs/:id/resolve', systemController.resolveLog);

// GET /api/system/status - Get system status
router.get('/status', systemController.getSystemStatus);

// POST /api/system/restart/:service - Restart service
router.post('/restart/:service', systemController.restartService);

module.exports = router;