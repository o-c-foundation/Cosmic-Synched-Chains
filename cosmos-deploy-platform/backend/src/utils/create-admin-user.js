/**
 * Admin User Creation Script
 * 
 * This script creates an admin user in the database with full access permissions.
 * It can be run using: node src/utils/create-admin-user.js
 */

const mongoose = require('mongoose');
const config = require('../config');
const { connectToDatabase } = require('./database');
const { checkMongoDB } = require('./check-mongodb');
const User = require('../models/User');

const createAdminUser = async () => {
  try {
    // Check if MongoDB is available
    const isMongoDBAvailable = await checkMongoDB();
    
    if (!isMongoDBAvailable) {
      console.error('\nError: MongoDB is not available. Please make sure MongoDB is running.');
      console.log(`
=================================================
MONGODB CONNECTION ERROR
=================================================
Make sure MongoDB is running with one of these commands:
  sudo service mongod start
  
Or if using Docker:
  docker-compose up -d mongodb
=================================================
`);
      process.exit(1);
    }
    
    // Connect to the database
    await connectToDatabase(config.mongoUri);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@cosmicsynched.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists. Skipping creation.');
      process.exit(0);
    }

    // Create the admin user
    const adminUser = new User({
      email: 'admin@cosmicsynched.com',
      password: 'CosmicAdmin2025!', // This should be changed after first login
      firstName: 'Admin',
      lastName: 'User',
      companyName: 'Syncron Labs',
      jobTitle: 'System Administrator',
      phoneNumber: '555-123-4567',
      role: 'admin',
      isVerified: true
    });

    // Save the admin user
    await adminUser.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@cosmicsynched.com');
    console.log('Password: CosmicAdmin2025!');
    console.log('IMPORTANT: Please change this password after first login');

    // Disconnect from the database
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

// Execute the function if this script is run directly
if (require.main === module) {
  createAdminUser();
}

module.exports = { createAdminUser };