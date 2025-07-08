/**
 * API Connectivity Debug Tool
 * 
 * This utility helps diagnose issues with frontend-backend connectivity
 * by making direct API calls and providing detailed error information.
 */

import axios from 'axios';

// Get the API base URL from environment variables or use the default
const API_URL = process.env.REACT_APP_API_URL || 'https://beta.syncron.network/api';

/**
 * Test basic connectivity to the backend
 * @returns {Promise<Object>} Result of the connectivity test
 */
export const testApiConnectivity = async () => {
  console.log('🔍 Testing API connectivity...');
  console.log(`API URL: ${API_URL}`);
  
  try {
    // Make a simple GET request to the root API endpoint
    const startTime = performance.now();
    const response = await axios.get(`${API_URL}/`);
    const endTime = performance.now();
    
    return {
      success: true,
      statusCode: response.status,
      message: 'Successfully connected to the API',
      responseTime: (endTime - startTime).toFixed(2) + 'ms',
      data: response.data
    };
  } catch (error) {
    return createErrorResponse(error, 'API connectivity test failed');
  }
};

/**
 * Test authentication by attempting to log in
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Result of the login test
 */
export const testLogin = async (email, password) => {
  console.log(`🔍 Testing login for user: ${email}`);
  
  try {
    // Make a login request
    const startTime = performance.now();
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    const endTime = performance.now();
    
    // Mask the token for security
    const maskedToken = response.data.token ? 
      response.data.token.substring(0, 10) + '...[MASKED]' : 
      'No token received';
    
    return {
      success: true,
      statusCode: response.status,
      message: 'Login successful',
      responseTime: (endTime - startTime).toFixed(2) + 'ms',
      token: maskedToken,
      user: response.data.user
    };
  } catch (error) {
    return createErrorResponse(error, 'Login test failed');
  }
};

/**
 * Test protected endpoint access
 * @param {string} token - JWT token
 * @returns {Promise<Object>} Result of the protected endpoint test
 */
export const testProtectedEndpoint = async (token) => {
  console.log('🔍 Testing protected endpoint access...');
  
  try {
    // Set up axios with auth header
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    
    // Make request to protected endpoint
    const startTime = performance.now();
    const response = await axios.get(`${API_URL}/auth/me`, config);
    const endTime = performance.now();
    
    return {
      success: true,
      statusCode: response.status,
      message: 'Successfully accessed protected endpoint',
      responseTime: (endTime - startTime).toFixed(2) + 'ms',
      data: response.data
    };
  } catch (error) {
    return createErrorResponse(error, 'Protected endpoint test failed');
  }
};

/**
 * Run a complete diagnostic test suite
 * @param {string} email - Admin email for testing
 * @param {string} password - Admin password for testing
 * @returns {Promise<Object>} Comprehensive test results
 */
export const runDiagnostics = async (email = 'admin@cosmicsynched.com', password = 'CosmicAdmin2025!') => {
  console.log('===============================================');
  console.log('🔍 FRONTEND-BACKEND CONNECTIVITY DIAGNOSTICS');
  console.log('===============================================');
  
  // Test results object
  const results = {
    apiConnectivity: null,
    authentication: null,
    protectedEndpoint: null,
    summary: null,
    timestamp: new Date().toISOString()
  };
  
  try {
    // Test 1: Basic API connectivity
    console.log('\n[TEST 1] Basic API Connectivity');
    results.apiConnectivity = await testApiConnectivity();
    console.log(results.apiConnectivity.success ? '✅ PASSED' : '❌ FAILED');
    
    // Test 2: Authentication
    console.log('\n[TEST 2] Authentication');
    results.authentication = await testLogin(email, password);
    console.log(results.authentication.success ? '✅ PASSED' : '❌ FAILED');
    
    // Only proceed to Test 3 if we have a token
    if (results.authentication.success && results.authentication.token) {
      const token = results.authentication.token.replace('...[MASKED]', '');
      
      // Test 3: Protected endpoint
      console.log('\n[TEST 3] Protected Endpoint Access');
      results.protectedEndpoint = await testProtectedEndpoint(token);
      console.log(results.protectedEndpoint.success ? '✅ PASSED' : '❌ FAILED');
    }
    
    // Generate summary
    let allTestsPassed = results.apiConnectivity.success && 
                        results.authentication.success && 
                        (results.protectedEndpoint ? results.protectedEndpoint.success : false);
    
    results.summary = {
      allTestsPassed,
      message: allTestsPassed ? 
        'All connectivity tests passed successfully.' : 
        'One or more connectivity tests failed. See individual test results for details.'
    };
    
    console.log('\n===============================================');
    console.log(allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
    console.log('===============================================');
    
    return results;
  } catch (error) {
    console.error('Error running diagnostics:', error);
    return {
      error: true,
      message: 'An unexpected error occurred while running diagnostics',
      details: error.message
    };
  }
};

/**
 * Helper to create consistent error response objects
 * @param {Error} error - The caught error
 * @param {string} context - Description of what failed
 * @returns {Object} Formatted error response
 */
const createErrorResponse = (error, context) => {
  const response = {
    success: false,
    message: context,
    errorType: error.name,
    errorMessage: error.message
  };
  
  // Add axios-specific error details if available
  if (error.response) {
    // Server responded with an error status
    response.statusCode = error.response.status;
    response.statusText = error.response.statusText;
    response.data = error.response.data;
  } else if (error.request) {
    // Request made but no response received
    response.networkError = true;
    response.requestInfo = {
      method: error.config?.method,
      url: error.config?.url
    };
  }
  
  return response;
};

// Export debugging functions for use in browser console or components
window.apiDebug = {
  testApiConnectivity,
  testLogin,
  testProtectedEndpoint,
  runDiagnostics
};

export default {
  testApiConnectivity,
  testLogin,
  testProtectedEndpoint,
  runDiagnostics
};