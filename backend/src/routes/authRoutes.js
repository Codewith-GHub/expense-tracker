const express = require('express');
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const validate = require('../middleware/validateMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { registerUser, loginUser, logoutUser, getMe } = require('../controllers/authController');

const router = express.Router();

// Throttle auth attempts: 10 requests per 15 minutes per IP, guards against brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many attempts, please try again later' },
});

router.post(
  '/register',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  registerUser
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  loginUser
);

router.post('/logout', protect, logoutUser);
router.get('/me', protect, getMe);

module.exports = router;