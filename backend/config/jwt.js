const jwt = require('jsonwebtoken');

const generateToken = (payload, expiresIn = '7d') => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
    issuer: 'tasknest-api',
    audience: 'tasknest-client'
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, {
    issuer: 'tasknest-api',
    audience: 'tasknest-client'
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: '30d',
    issuer: 'tasknest-api',
    audience: 'tasknest-client'
  });
};

module.exports = {
  generateToken,
  verifyToken,
  generateRefreshToken
};

