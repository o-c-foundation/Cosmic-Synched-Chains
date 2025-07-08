const express = require('express');
const router = express.Router();
const networkController = require('../controllers/networkController');
const { protect, authorize } = require('../middlewares/auth');

// Protect all routes
router.use(protect);

// Network routes
router.route('/')
  .get(networkController.getNetworks)
  .post(networkController.createNetwork);

router.route('/:id')
  .get(networkController.getNetwork)
  .put(networkController.updateNetwork)
  .delete(networkController.deleteNetwork);

// Deployment routes
router.post('/:id/deploy', networkController.deployNetwork);
router.post('/:id/backup', networkController.backupNetwork);
router.post('/:id/restore/:backupId', networkController.restoreNetwork);

module.exports = router;