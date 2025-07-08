const express = require('express');
const router = express.Router();
const networkController = require('../controllers/networkController');

// GET /api/networks - Get all networks
router.get('/', networkController.getNetworks);

// GET /api/networks/:id - Get single network
router.get('/:id', networkController.getNetwork);

// POST /api/networks - Create network
router.post('/', networkController.createNetwork);

// PUT /api/networks/:id - Update network
router.put('/:id', networkController.updateNetwork);

// DELETE /api/networks/:id - Delete network
router.delete('/:id', networkController.deleteNetwork);

// PUT /api/networks/:id/status - Update network status
router.put('/:id/status', networkController.updateNetworkStatus);

// GET /api/networks/stats - Get network statistics
router.get('/stats/summary', networkController.getNetworkStats);

// POST /api/networks/:id/validators - Add/update validator
router.post('/:id/validators', networkController.manageValidator);

// DELETE /api/networks/:id/validators/:validatorId - Remove validator
router.delete('/:id/validators/:validatorId', networkController.removeValidator);

module.exports = router;