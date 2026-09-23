const rateLimit = require('express-rate-limit');

// Limiter for authentication routes (login / register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 auth attempts per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.'
  }
});

// Limiter for email verification requests to prevent spamming verification emails
const verificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 verification actions per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many verification requests from this IP. Please try again after 15 minutes.'
  }
});

module.exports = {
  authLimiter,
  verificationLimiter
};
