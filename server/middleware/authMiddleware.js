const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      
      // Log the token for debugging (remove in production)
      console.log('Token received:', token);
      
      // Check if token exists and is properly formatted
      if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
      }
      
      // Check if token is a valid string
      if (typeof token !== 'string') {
        return res.status(401).json({ message: 'Not authorized, invalid token format' });
      }
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'greenlands_secret');
      
      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');
      
      next();
    } catch (error) {
      console.error('JWT Error:', error.name, error.message);
      if (error.name === 'JsonWebTokenError') {
        if (error.message === 'jwt malformed') {
          res.status(401).json({ message: 'Not authorized, token is malformed' });
        } else {
          res.status(401).json({ message: 'Not authorized, invalid token' });
        }
      } else if (error.name === 'TokenExpiredError') {
        res.status(401).json({ message: 'Not authorized, token expired' });
      } else {
        res.status(401).json({ message: 'Not authorized, token failed' });
      }
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'User role not authorized'
      });
    }
    next();
  };
};

module.exports = { protect, authorize };