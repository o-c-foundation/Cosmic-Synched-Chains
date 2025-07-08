const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config');
const { errorHandler } = require('./middlewares/errorHandler');
const database = require('./utils/database');

// Import routes
const indexRoutes = require('./routes/index');
const networkRoutes = require('./routes/networkRoutes');
const authRoutes = require('./routes/authRoutes');

// Create Express app
const app = express();

// Connect to MongoDB
database.connect();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/', indexRoutes);
app.use('/api/networks', networkRoutes);
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