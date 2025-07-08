/**
 * Production Environment Configuration Checker
 * 
 * This utility verifies that the application is properly configured for production use.
 * It checks for required environment variables, security settings, and best practices.
 */

const config = require('../config');
const chalk = require('chalk');

/**
 * Run all production configuration checks
 * @returns {Object} Results of all checks
 */
const checkProductionConfig = () => {
  const results = {
    passed: [],
    warnings: [],
    critical: [],
  };

  // Only run in production environment
  if (process.env.NODE_ENV !== 'production') {
    console.log(chalk.yellow('⚠️  Not running in production mode - skipping production checks'));
    return results;
  }

  console.log(chalk.blue('🔍 Running production configuration checks...'));

  // Check for secure JWT secret
  if (!config.jwtSecret || config.jwtSecret === 'your-default-jwt-secret') {
    results.critical.push('JWT_SECRET is not set or using default value');
    console.log(chalk.red('❌ Critical: JWT_SECRET is using an insecure default value'));
  } else if (config.jwtSecret.length < 32) {
    results.warnings.push('JWT_SECRET is too short (< 32 chars)');
    console.log(chalk.yellow('⚠️  Warning: JWT_SECRET is shorter than recommended (32+ chars)'));
  } else {
    results.passed.push('JWT_SECRET properly configured');
    console.log(chalk.green('✅ JWT_SECRET properly configured'));
  }

  // Check for secure MongoDB URI
  if (!config.mongoUri || config.mongoUri.includes('localhost') || config.mongoUri.includes('127.0.0.1')) {
    results.critical.push('MONGO_URI is not set or using localhost');
    console.log(chalk.red('❌ Critical: MONGO_URI is using localhost, not suitable for production'));
  } else {
    results.passed.push('MONGO_URI properly configured');
    console.log(chalk.green('✅ MONGO_URI properly configured'));
  }

  // Check for secure PORT configuration
  if (!config.port) {
    results.warnings.push('PORT is not explicitly set');
    console.log(chalk.yellow('⚠️  Warning: PORT is not explicitly set, using default'));
  } else {
    results.passed.push('PORT properly configured');
    console.log(chalk.green('✅ PORT properly configured'));
  }

  // Check for CORS configuration
  if (!config.corsOrigin || config.corsOrigin === '*') {
    results.warnings.push('CORS_ORIGIN is not set or using wildcard "*"');
    console.log(chalk.yellow('⚠️  Warning: CORS_ORIGIN is using wildcard "*", not recommended for production'));
  } else {
    results.passed.push('CORS_ORIGIN properly configured');
    console.log(chalk.green('✅ CORS_ORIGIN properly configured'));
  }

  // Check for rate limiting
  if (!config.rateLimit || config.rateLimit.enabled === false) {
    results.warnings.push('Rate limiting is disabled');
    console.log(chalk.yellow('⚠️  Warning: Rate limiting is disabled, recommended for production'));
  } else {
    results.passed.push('Rate limiting enabled');
    console.log(chalk.green('✅ Rate limiting enabled'));
  }

  // Check TLS configuration
  if (config.requireTLS !== true) {
    results.warnings.push('TLS is not required');
    console.log(chalk.yellow('⚠️  Warning: TLS not enforced, highly recommended for production'));
  } else {
    results.passed.push('TLS is enforced');
    console.log(chalk.green('✅ TLS is enforced'));
  }

  // Summary
  console.log('\n' + chalk.blue('📊 Production Check Summary:'));
  console.log(chalk.green(`✅ Passed: ${results.passed.length}`));
  console.log(chalk.yellow(`⚠️  Warnings: ${results.warnings.length}`));
  console.log(chalk.red(`❌ Critical: ${results.critical.length}`));
  
  if (results.critical.length > 0) {
    console.log(chalk.red('\n⛔ CRITICAL ISSUES MUST BE FIXED BEFORE DEPLOYMENT ⛔'));
  }
  
  return results;
};

module.exports = {
  checkProductionConfig
};
