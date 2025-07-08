/**
 * API Endpoint Diagnostic Tool
 * 
 * This script tests the API endpoints to ensure they are correctly configured
 * and responds to requests. It helps diagnose 404 errors in the frontend.
 */

const express = require('express');
const http = require('http');

// Create a test app
const app = express();

// Set port
const PORT = 5001;

// Simple test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint is working' });
});

// Start the test server
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
});

// Function to check an API endpoint
const checkEndpoint = async (url) => {
  return new Promise((resolve) => {
    const options = {
      method: 'GET',
      timeout: 3000,
    };
    
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data,
          url: url
        });
      });
    });
    
    req.on('error', (error) => {
      resolve({
        error: error.message,
        url: url
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        error: 'Request timed out',
        url: url
      });
    });
    
    req.end();
  });
};

// Main function to run the checks
const runChecks = async () => {
  console.log('===============================================');
  console.log('🔍 API ENDPOINT DIAGNOSTICS');
  console.log('===============================================\n');
  
  // Define endpoints to check
  const endpoints = [
    'http://localhost:5000/',
    'http://localhost:5000/api',
    'http://localhost:5000/api/auth/login',
    'http://localhost:5000/api/networks'
  ];
  
  // Check each endpoint
  for (const endpoint of endpoints) {
    console.log(`Checking: ${endpoint}`);
    const result = await checkEndpoint(endpoint);
    
    if (result.error) {
      console.log(`  ❌ Error: ${result.error}`);
    } else {
      const statusSymbol = result.status >= 200 && result.status < 400 ? '✅' : '❌';
      console.log(`  ${statusSymbol} Status: ${result.status}`);
      console.log(`  Content-Type: ${result.headers['content-type'] || 'not specified'}`);
      console.log(`  Response: ${result.data.substring(0, 100)}${result.data.length > 100 ? '...' : ''}`);
    }
    console.log();
  }
  
  console.log('===============================================');
  console.log('✨ RECOMMENDATIONS:');
  console.log('===============================================');
  console.log('1. Ensure server.js routes are correctly configured');
  console.log('2. Verify that authRoutes and networkRoutes are properly mounted');
  console.log('3. Check for any middleware issues');
  console.log('4. Restart the server after making changes');
  console.log('===============================================');
  
  // Clean up
  server.close();
  process.exit(0);
};

// Run the checks
runChecks();