const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./config');
const errorHandler = require('./middlewares/errorHandler');
const database = require('./utils/database');
const { checkProductionConfig } = require('./utils/productionCheck');

// Import routes
const indexRoutes = require('./routes/index');
const networkRoutes = require('./routes/networkRoutes');
const authRoutes = require('./routes/authRoutes');
const healthRoutes = require('./routes/healthRoutes');

// Create Express app
const app = express();

// Trust proxy - required for rate limiting behind reverse proxies
app.set('trust proxy', 1);

// Connect to MongoDB
database.connectToDatabase(config.mongoUri)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Production checks
if (process.env.NODE_ENV === 'production') {
  checkProductionConfig();
}

// Security middleware
app.use(helmet()); // Set security-related HTTP headers

// Configure CORS
app.use(cors({
  origin: config.corsOrigin || ['http://localhost:3000', 'https://beta.syncron.network'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply rate limiting to sensitive routes
app.use('/api/auth', apiLimiter);

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware - use morgan in production and dev mode
if (process.env.NODE_ENV === 'production') {
  // Use combined format for production with log rotation
  app.use(morgan('combined'));
} else {
  // Use dev format for development
  app.use(morgan('dev'));
}

// Direct health endpoint (accessible at /health)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    message: 'Service is up and running',
    timestamp: new Date().toISOString()
  });
});

// Routes - All routes are mounted via the index router
app.use('/api', indexRoutes); // This includes auth, networks, and health routes

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