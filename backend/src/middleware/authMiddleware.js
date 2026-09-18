const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token provided'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      res.status(401);
      return next(new Error('Not authorized, user no longer exists'));
    }

    next();
  } catch (err) {
    res.status(401);
    next(new Error('Not authorized, invalid or expired token'));
  }
};

module.exports = { protect };