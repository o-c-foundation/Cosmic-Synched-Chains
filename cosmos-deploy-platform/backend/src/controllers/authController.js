const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, companyName, jobTitle, phoneNumber } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }
    
    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      companyName,
      jobTitle,
      phoneNumber
    });
    
    // Send token response
    sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }
    
    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Send token response
    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res, next) => {
  try {
    // User is already available in req.user due to auth middleware
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          companyName: user.companyName,
          jobTitle: user.jobTitle,
          phoneNumber: user.phoneNumber,
          role: user.role,
          isVerified: user.isVerified,
          createdAt: user.createdAt
        }
      }
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving user data',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * @desc    Update user details
 * @route   PUT /api/auth/updatedetails
 * @access  Private
 */
exports.updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      companyName: req.body.companyName,
      jobTitle: req.body.jobTitle,
      phoneNumber: req.body.phoneNumber
    };
    
    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );
    
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          companyName: user.companyName,
          jobTitle: user.jobTitle,
          phoneNumber: user.phoneNumber,
          role: user.role,
          isVerified: user.isVerified,
          createdAt: user.createdAt
        }
      }
    });
  } catch (err) {
    console.error('Update user details error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error updating user details',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * @desc    Update password
 * @route   PUT /api/auth/updatepassword
 * @access  Private
 */
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Validate inputs
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }
    
    const user = await User.findById(req.user.id).select('+password');
    
    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error('Update password error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error updating password',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * @desc    Logout user / clear cookie
 * @route   GET /api/auth/logout
 * @access  Private
 */
exports.logout = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'User logged out successfully'
  });
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();
  
  // Remove password from output
  user.password = undefined;
  
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      companyName: user.companyName,
      jobTitle: user.jobTitle,
      phoneNumber: user.phoneNumber,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt
    }
  });
};