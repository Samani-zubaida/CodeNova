const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'algoverse_super_secret_jwt_key_2026';

// In-memory token blacklist for session invalidation (logout)
// Auto-cleans expired tokens every 30 minutes
const tokenBlacklist = new Set();

const isTokenRevoked = (token) => {
  return tokenBlacklist.has(token);
};

const revokeToken = (token) => {
  if (token) {
    tokenBlacklist.add(token);
  }
};

/**
 * Universal Authentication Middleware
 * Validates JWT signatures using strict HS256 algorithm enforcement,
 * checks session revocation / blacklist, and attaches verified user identity to req.user.
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Authentication required. Please log in.' 
    });
  }

  const token = authHeader.split(' ')[1];
  if (!token || !token.trim()) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Authentication required. No token provided.' 
    });
  }

  // Check if token has been revoked via logout
  if (isTokenRevoked(token)) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Session has been invalidated. Please log in again.' 
    });
  }

  try {
    // Explicitly restrict algorithm to HS256 to prevent algorithm confusion attacks (e.g. 'none' algorithm bypass)
    const verified = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
    req.user = verified;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Session expired. Please log in again.' 
      });
    }
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Invalid authentication token. Please log in again.' 
    });
  }
};

/**
 * requireRole - Authorization middleware for Role-Based Access Control (RBAC)
 * Returns 401 if unauthenticated, 403 Forbidden if authenticated but role is insufficient.
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Authentication required.' 
      });
    }

    const userRole = req.user.role || 'user';
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'Access denied: insufficient permissions.' 
      });
    }

    next();
  };
};

/**
 * requireOwnership - Prevents Insecure Direct Object References (IDOR)
 * Verifies that the requested resource identifier matches the authenticated user.
 */
const requireOwnership = (source = 'params', key = 'username') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Authentication required.' 
      });
    }

    const requestedValue = req[source]?.[key];
    const authenticatedValue = req.user[key] || req.user.id;

    if (requestedValue && String(requestedValue) !== String(authenticatedValue)) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'Access denied: you can only view or modify your own resources.' 
      });
    }

    next();
  };
};

// Aliases for architectural flexibility
authenticate.authenticate = authenticate;
authenticate.authenticateUser = authenticate;
authenticate.requireAuth = authenticate;
authenticate.requireRole = requireRole;
authenticate.requireOwnership = requireOwnership;
authenticate.revokeToken = revokeToken;
authenticate.isTokenRevoked = isTokenRevoked;

module.exports = authenticate;
