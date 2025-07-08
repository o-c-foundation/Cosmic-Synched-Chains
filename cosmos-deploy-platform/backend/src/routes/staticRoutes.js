/**
 * Static Asset Routes
 * 
 * This file handles serving static assets through the API
 */

const express = require('express');
const path = require('path');
const router = express.Router();

// Set up the assets path
const assetsPath = path.join(__dirname, '../../public/assets');

// Serve static assets
router.use('/assets', express.static(assetsPath));

// Add specific routes for commonly accessed images
router.get('/setup-wizard.png', (req, res) => {
  res.sendFile(path.join(assetsPath, 'images/setup-wizard.png'));
});

router.get('/dashboard-preview.png', (req, res) => {
  res.sendFile(path.join(assetsPath, 'images/dashboard-preview.png'));
});

module.exports = router;
