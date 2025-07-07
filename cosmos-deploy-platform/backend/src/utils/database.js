/**
 * Database Connection Utility
 * 
 * Handles MongoDB connection and provides utility functions for database operations.
 */

const mongoose = require('mongoose');

/**
 * Connect to MongoDB
 * 
 * @param {string} uri - MongoDB connection URI
 * @returns {Promise<mongoose.Connection>} Mongoose connection object
 */
const connectToDatabase = async (uri) => {
  try {
    // Configure Mongoose options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: process.env.NODE_ENV !== 'production', // Don't build indexes in production for performance
    };

    // Connect to MongoDB
    await mongoose.connect(uri, options);
    
    // Get the connection instance
    const connection = mongoose.connection;
    
    // Set up event handlers
    connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });
    
    connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });
    
    connection.on('reconnected', () => {
      console.info('MongoDB reconnected successfully');
    });
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      await connection.close();
      console.info('MongoDB connection closed through app termination');
      process.exit(0);
    });
    
    return connection;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    throw error;
  }
};

/**
 * Create indexes for all models
 * 
 * This function creates indexes for all registered Mongoose models.
 * Useful when autoIndex is set to false in production.
 * 
 * @returns {Promise<void>}
 */
const createIndexes = async () => {
  try {
    const modelNames = mongoose.modelNames();
    
    for (const modelName of modelNames) {
      const model = mongoose.model(modelName);
      await model.createIndexes();
      console.info(`Created indexes for model: ${modelName}`);
    }
    
    console.info('All indexes created successfully');
  } catch (error) {
    console.error(`Error creating indexes: ${error.message}`);
    throw error;
  }
};

/**
 * Check database health
 * 
 * @returns {Promise<Object>} Database health status
 */
const checkDatabaseHealth = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return {
        status: 'error',
        message: 'Database not connected',
        readyState: mongoose.connection.readyState,
      };
    }
    
    // Attempt a simple operation to verify database is responding
    const adminDb = mongoose.connection.db.admin();
    const serverStatus = await adminDb.serverStatus();
    
    return {
      status: 'ok',
      message: 'Database connected and operational',
      version: serverStatus.version,
      uptime: serverStatus.uptime,
      connections: serverStatus.connections,
    };
  } catch (error) {
    return {
      status: 'error',
      message: `Database health check failed: ${error.message}`,
      error: error.toString(),
    };
  }
};

/**
 * Get database statistics
 * 
 * @returns {Promise<Object>} Database statistics
 */
const getDatabaseStats = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected');
    }
    
    const db = mongoose.connection.db;
    const stats = await db.stats();
    
    return {
      dbName: stats.db,
      collections: stats.collections,
      documents: stats.objects,
      dataSize: stats.dataSize,
      storageSize: stats.storageSize,
      indexes: stats.indexes,
      indexSize: stats.indexSize,
    };
  } catch (error) {
    console.error(`Error getting database stats: ${error.message}`);
    throw error;
  }
};

module.exports = {
  connectToDatabase,
  createIndexes,
  checkDatabaseHealth,
  getDatabaseStats,
};