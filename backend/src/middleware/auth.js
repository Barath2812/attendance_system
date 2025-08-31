const jwt = require('jsonwebtoken');
const { User } = require('../models/index');

function auth(required = true) {
  return async (req, res, next) => {
    try {
      const header = req.headers.authorization || req.cookies.token;
      if (!header) {
        if (!required) return next();
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const token = header.startsWith('Bearer ') ? header.split(' ')[1] : header;
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
      const user = await User.findByPk(payload.id);
      if (!user) return res.status(401).json({ message: 'Unauthorized' });
      req.user = user.toJSON();
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}

function requireRole(roles) {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    if (!req.user || !allowed.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}

module.exports = { auth, requireRole };


