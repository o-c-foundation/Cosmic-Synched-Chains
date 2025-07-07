/**
 * Global Error Handler Middleware
 * 
 * Provides consistent error handling across the application.
 * Formats error responses and logs errors appropriately.
 */

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  // Default status code to 500 if not specified
  const statusCode = err.status || err.statusCode || 500;
  
  // Format the error message
  const errorResponse = {
    error: {
      message: err.message || 'Internal Server Error',
      status: statusCode,
    },
  };
  
  // Add stack trace in development mode
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack;
    
    // If there are additional details, include them
    if (err.details) {
      errorResponse.error.details = err.details;
    }
  }
  
  // Log the error (with different levels based on severity)
  if (statusCode >= 500) {
    console.error(`[${new Date().toISOString()}] Server Error:`, {
      path: req.path,
      method: req.method,
      statusCode,
      message: err.message,
      stack: err.stack,
      body: req.body,
      params: req.params,
      query: req.query,
    });
  } else if (statusCode >= 400 && statusCode < 500) {
    console.warn(`[${new Date().toISOString()}] Client Error:`, {
      path: req.path,
      method: req.method,
      statusCode,
      message: err.message,
    });
  }
  
  // MongoDB validation error handling
  if (err.name === 'ValidationError') {
    errorResponse.error.message = 'Validation Error';
    errorResponse.error.details = Object.values(err.errors).map(e => ({
      path: e.path,
      message: e.message,
      value: e.value,
    }));
  }
  
  // MongoDB duplicate key error
  if (err.name === 'MongoError' && err.code === 11000) {
    errorResponse.error.message = 'Duplicate Key Error';
    errorResponse.error.details = {
      keyPattern: err.keyPattern,
      keyValue: err.keyValue,
    };
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    errorResponse.error.message = 'Invalid Token';
    errorResponse.error.status = 401;
  }
  
  if (err.name === 'TokenExpiredError') {
    errorResponse.error.message = 'Token Expired';
    errorResponse.error.status = 401;
  }
  
  // Special handling for specific custom error types
  if (err.name === 'NetworkDeploymentError') {
    errorResponse.error.details = {
      networkId: err.networkId,
      deploymentStage: err.deploymentStage,
      reason: err.reason,
    };
  }
  
  if (err.name === 'ResourceNotFoundError') {
    errorResponse.error.message = `Resource not found: ${err.resource}`;
    errorResponse.error.status = 404;
  }
  
  // Send the error response
  res.status(statusCode).json(errorResponse);
};

// Custom error classes

/**
 * Resource Not Found Error
 */
class ResourceNotFoundError extends Error {
  constructor(resource, message) {
    super(message || `Resource not found: ${resource}`);
    this.name = 'ResourceNotFoundError';
    this.resource = resource;
    this.status = 404;
  }
}

/**
 * Validation Error
 */
class ValidationError extends Error {
  constructor(message, details) {
    super(message || 'Validation Error');
    this.name = 'ValidationError';
    this.details = details;
    this.status = 400;
  }
}

/**
 * Authentication Error
 */
class AuthenticationError extends Error {
  constructor(message) {
    super(message || 'Authentication failed');
    this.name = 'AuthenticationError';
    this.status = 401;
  }
}

/**
 * Authorization Error
 */
class AuthorizationError extends Error {
  constructor(message) {
    super(message || 'You do not have permission to perform this action');
    this.name = 'AuthorizationError';
    this.status = 403;
  }
}

/**
 * Network Deployment Error
 */
class NetworkDeploymentError extends Error {
  constructor(message, networkId, deploymentStage, reason) {
    super(message || `Network deployment failed at stage: ${deploymentStage}`);
    this.name = 'NetworkDeploymentError';
    this.networkId = networkId;
    this.deploymentStage = deploymentStage;
    this.reason = reason;
    this.status = 500;
  }
}

/**
 * Rate Limit Error
 */
class RateLimitError extends Error {
  constructor(message, resetTime) {
    super(message || 'Rate limit exceeded');
    this.name = 'RateLimitError';
    this.resetTime = resetTime;
    this.status = 429;
  }
}

// Export error handler and custom error classes
module.exports = errorHandler;
module.exports.ResourceNotFoundError = ResourceNotFoundError;
module.exports.ValidationError = ValidationError;
module.exports.AuthenticationError = AuthenticationError;
module.exports.AuthorizationError = AuthorizationError;
module.exports.NetworkDeploymentError = NetworkDeploymentError;
module.exports.RateLimitError = RateLimitError;