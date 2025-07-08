const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', protect, authController.getMe);
router.put('/updatedetails', protect, authController.updateDetails);
router.put('/updatepassword', protect, authController.updatePassword);
router.get('/logout', protect, authController.logout);

module.exports = router;