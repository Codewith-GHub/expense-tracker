const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc   Register a new user
// @route  POST /api/auth/register
// @access Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error('Email is already registered');
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        user: { id: user._id, name: user.name, email: user.email },
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Login user
// @route  POST /api/auth/login
// @access Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        user: { id: user._id, name: user.name, email: user.email },
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Logout (stateless JWT — this endpoint exists for API symmetry and
//         as a hook for future refresh-token/blacklist support)
// @route  POST /api/auth/logout
// @access Private
const logoutUser = async (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc   Get current logged-in user — example protected route
// @route  GET /api/auth/me
// @access Private
const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    data: { id: req.user._id, name: req.user.name, email: req.user.email },
  });
};

module.exports = { registerUser, loginUser, logoutUser, getMe };