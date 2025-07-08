/**
 * API Routes Index
 * 
 * This file combines all route modules and exports them as a single router.
 */

const express = require('express');
const networkRoutes = require('./networkRoutes');
const authRoutes = require('./authRoutes');
const healthRoutes = require('./healthRoutes');
const { ResourceNotFoundError } = require('../middlewares/errorHandler');

const router = express.Router();

// API version and info
router.get('/', (req, res) => {
  res.json({
    name: 'Cosmos Deploy Platform API',
    version: '1.0.0',
    documentation: '/api/docs',
  });
});

// Documentation route (placeholder for Swagger/OpenAPI docs)
router.get('/docs', (req, res) => {
  res.json({
    message: 'API documentation will be available here',
    // In a production environment, this would serve Swagger UI or redirect to docs
  });
});

// Mount specific route modules
router.use('/auth', authRoutes);
router.use('/networks', networkRoutes);
router.use('/health', healthRoutes);

// Future route modules would be added here
// router.use('/users', userRoutes);
// router.use('/validators', validatorRoutes);
// router.use('/monitoring', monitoringRoutes);
// router.use('/governance', governanceRoutes);

// 404 handler for API routes
router.use((req, res, next) => {
  next(new ResourceNotFoundError('API Endpoint', `Endpoint not found: ${req.method} ${req.originalUrl}`));
});

module.exports = router;