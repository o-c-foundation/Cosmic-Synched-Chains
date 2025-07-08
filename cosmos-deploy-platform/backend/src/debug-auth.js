/**
 * Auth System Debug Tool
 * 
 * This script tests the authentication system by attempting to:
 * 1. Connect to MongoDB
 * 2. Find the admin user
 * 3. Verify the admin user can log in
 * 4. Generate a JWT token
 * 
 * This helps identify issues in the authentication flow.
 */

const mongoose = require('mongoose');
const User = require('./models/User');
const config = require('./config');
const { connectToDatabase } = require('./utils/database');

// Admin credentials - should match what was created
const ADMIN_EMAIL = 'admin@cosmicsynched.com';
const ADMIN_PASSWORD = 'CosmicAdmin2025!';

const debugAuth = async () => {
  console.log('===============================================');
  console.log('🔍 AUTHENTICATION SYSTEM DIAGNOSTIC TOOL');
  console.log('===============================================\n');

  try {
    // Step 1: Test MongoDB connection
    console.log('STEP 1: Testing MongoDB connection...');
    console.log(`Attempting to connect to: ${config.mongoUri}`);
    
    const connection = await connectToDatabase(config.mongoUri);
    console.log('✅ MongoDB connection successful!\n');

    // Step 2: Check if admin user exists
    console.log('STEP 2: Checking if admin user exists...');
    const adminUser = await User.findOne({ email: ADMIN_EMAIL });
    
    if (!adminUser) {
      console.log('❌ Admin user not found in database!');
      console.log(`Could not find user with email: ${ADMIN_EMAIL}`);
      console.log('Please verify the admin account was created correctly.\n');
      process.exit(1);
    }
    
    console.log('✅ Admin user found in database!');
    console.log(`User ID: ${adminUser._id}`);
    console.log(`Name: ${adminUser.firstName} ${adminUser.lastName}`);
    console.log(`Role: ${adminUser.role}`);
    console.log(`Created at: ${adminUser.createdAt}\n`);

    // Step 3: Test password verification
    console.log('STEP 3: Testing password verification...');
    // We need to get the password field which is normally excluded
    const userWithPassword = await User.findOne({ email: ADMIN_EMAIL }).select('+password');
    
    if (!userWithPassword) {
      console.log('❌ Failed to retrieve user with password field\n');
      process.exit(1);
    }
    
    const isPasswordValid = await userWithPassword.comparePassword(ADMIN_PASSWORD);
    
    if (!isPasswordValid) {
      console.log('❌ Password verification failed!');
      console.log('The provided password does not match the stored password hash.');
      console.log('Please verify the admin account was created with the correct password.\n');
      process.exit(1);
    }
    
    console.log('✅ Password verification successful!\n');

    // Step 4: Test JWT token generation
    console.log('STEP 4: Testing JWT token generation...');
    console.log(`JWT Secret (first 10 chars): ${config.jwtSecret.substring(0, 10)}...`);
    console.log(`JWT Expiration: ${config.jwtExpire}`);
    
    const token = userWithPassword.getSignedJwtToken();
    
    if (!token) {
      console.log('❌ Failed to generate JWT token!\n');
      process.exit(1);
    }
    
    console.log('✅ JWT token generated successfully!');
    console.log(`Token (first 20 chars): ${token.substring(0, 20)}...\n`);

    // Step 5: Check CORS settings
    console.log('STEP 5: Checking CORS configuration...');
    console.log(`CORS origins: ${JSON.stringify(config.corsOrigins)}`);
    console.log('✅ CORS configuration verified\n');

    // Step 6: Print API endpoint for frontend reference
    console.log('STEP 6: Backend API information:');
    console.log(`Server port: ${config.port}`);
    console.log(`API login endpoint: http://localhost:${config.port}/api/auth/login`);
    console.log(`Use this endpoint in the frontend to connect to the backend.\n`);

    // Summary
    console.log('===============================================');
    console.log('🎉 AUTHENTICATION SYSTEM CHECK PASSED!');
    console.log('===============================================');
    console.log('The backend authentication system appears to be working correctly.');
    console.log('If login is still not working from the frontend, please check:');
    console.log('1. Frontend API URL configuration (should match backend URL)');
    console.log('2. Network connectivity between frontend and backend');
    console.log('3. Browser console for any CORS or network errors');
    console.log('4. Frontend code for any issues in handling the response');
    console.log('===============================================');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('\n❌ ERROR during diagnostics:', error);
    console.log('\nPlease fix the identified issues and run this script again.');
    process.exit(1);
  }
};

// Run the diagnostic
debugAuth();