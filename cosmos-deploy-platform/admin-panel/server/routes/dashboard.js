const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// GET /api/dashboard - Get dashboard data
router.get('/', dashboardController.getDashboardData);

// GET /api/dashboard/quick-stats - Get quick stats for admin panel header
router.get('/quick-stats', dashboardController.getQuickStats);

// GET /api/dashboard/activity - Get activity feed
router.get('/activity', dashboardController.getActivityFeed);

module.exports = router;