const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectToDatabase } = require('./utils/database');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const config = require('./config');

// Create Express app
const app = express();

// Apply middlewares
app.use(helmet()); // Security headers
app.use(cors({
  origin: config.corsOrigins,
  credentials: true
}));
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// API routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Handle 404 errors
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

// Global error handler
app.use(errorHandler);

// Start the server
const PORT = config.port || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    if (config.mongoUri) {
      await connectToDatabase(config.mongoUri);
      console.log('📊 Connected to MongoDB');
    } else {
      console.warn('⚠️ No MongoDB URI provided, running without database');
    }
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`
      🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}
      
      ✅ API: http://localhost:${PORT}/api
      🏥 Health: http://localhost:${PORT}/health
      
      Cosmos Deploy Platform API Server
      ================================
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION:', err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

// Export for testing
module.exports = { app, startServer };