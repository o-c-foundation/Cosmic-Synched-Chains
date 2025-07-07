/**
 * Authentication Middleware
 * 
 * Verifies JWT tokens from request headers and attaches the user to the request object.
 */

const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('./errorHandler');
const User = require('../models/User');
const config = require('../config');

/**
 * Middleware to authenticate requests using JWT
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('x-auth-token') || 
                  req.header('authorization')?.replace('Bearer ', '') || 
                  req.cookies?.token;
    
    // Check if token exists
    if (!token) {
      throw new AuthenticationError('No authentication token provided');
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwtSecret);
      
      // Find user by id
      const user = await User.findById(decoded.id).select('-password');
      
      // Check if user exists
      if (!user) {
        throw new AuthenticationError('User not found');
      }
      
      // Attach user to request
      req.user = user;
      
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new AuthenticationError('Invalid token');
      } else if (error.name === 'TokenExpiredError') {
        throw new AuthenticationError('Token expired');
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to check if user has admin role
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    next(new AuthenticationError('Admin access required'));
  }
};

// For development/testing only - bypass authentication
const devBypass = (req, res, next) => {
  // Only use in development environment
  if (process.env.NODE_ENV !== 'production' && process.env.BYPASS_AUTH === 'true') {
    console.warn('⚠️ WARNING: Authentication bypassed in development mode');
    
    // Create a mock user
    req.user = {
      _id: 'dev-user-id',
      name: 'Development User',
      email: 'dev@example.com',
      role: 'admin'
    };
    
    next();
  } else {
    // Fall back to regular auth in production
    auth(req, res, next);
  }
};

module.exports = process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true' 
  ? devBypass 
  : auth;

module.exports.requireAdmin = requireAdmin;