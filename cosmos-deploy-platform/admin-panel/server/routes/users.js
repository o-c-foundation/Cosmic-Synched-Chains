const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /api/users - Get all users
router.get('/', userController.getUsers);

// GET /api/users/:id - Get single user
router.get('/:id', userController.getUser);

// POST /api/users - Create user
router.post('/', userController.createUser);

// PUT /api/users/:id - Update user
router.put('/:id', userController.updateUser);

// DELETE /api/users/:id - Delete user
router.delete('/:id', userController.deleteUser);

// POST /api/users/:id/reset-password - Reset user password
router.post('/:id/reset-password', userController.resetPassword);

module.exports = router;