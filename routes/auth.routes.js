const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', authController.login);

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authController.register);

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', authController.forgotPassword);

// @route   GET /api/auth/verify
// @desc    Verify JWT token
// @access  Private
router.get('/verify', authController.verifyToken);

module.exports = router;