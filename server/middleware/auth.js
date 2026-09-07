const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAdmin = async (req, res, next) => {
  try {
    // Read token from cookies or Authorization header
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Not authorized, no token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ error: 'User no longer exists' });
    }

    // Check if user is an admin
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Admin role required' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { requireAdmin };