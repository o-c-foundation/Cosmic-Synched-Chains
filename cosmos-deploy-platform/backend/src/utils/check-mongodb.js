/**
 * MongoDB Availability Check
 * 
 * This script checks if MongoDB is running and available.
 * It's used by the admin user creation script to ensure the database is accessible.
 */

const mongoose = require('mongoose');
const config = require('../config');

const checkMongoDB = async () => {
  try {
    console.log(`Attempting to connect to MongoDB at: ${config.mongoUri}`);
    
    // Set connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    };

    // Try to connect
    await mongoose.connect(config.mongoUri, options);
    console.log('MongoDB connection successful!');
    
    // Disconnect after successful check
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
    
    return true;
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    return false;
  }
};

// Execute if this script is run directly
if (require.main === module) {
  checkMongoDB().then(success => {
    if (!success) {
      console.log(`
=================================================
MongoDB CONNECTION ERROR
=================================================
Make sure MongoDB is running with the command:
  sudo service mongod start
  
Or if using Docker:
  docker-compose up -d mongodb
=================================================
`);
      process.exit(1);
    }
    process.exit(0);
  });
}

module.exports = { checkMongoDB };