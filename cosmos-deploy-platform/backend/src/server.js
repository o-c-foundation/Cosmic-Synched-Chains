const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config');
const errorHandler = require('./middlewares/errorHandler');
const database = require('./utils/database');

// Import routes
const indexRoutes = require('./routes/index');
const networkRoutes = require('./routes/networkRoutes');
const authRoutes = require('./routes/authRoutes');
const healthRoutes = require('./routes/healthRoutes');

// Create Express app
const app = express();

// Connect to MongoDB
database.connectToDatabase(config.mongoUri)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: config.corsOrigins || ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Direct health endpoint (accessible at /health)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Service is up and running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api', indexRoutes);  // All API routes including /api/health
app.use('/api/networks', networkRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = config.port || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});

module.exports = app;