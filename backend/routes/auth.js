const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const validator = require('validator');
const mongoose = require('mongoose');

const User = require('../models/User');
const storage = require('../services/storage');
const emailService = require('../services/emailService');
const { authLimiter, verificationLimiter } = require('../middleware/rateLimiter');
const authenticate = require('../middleware/authMiddleware');
const { revokeToken } = authenticate;

const JWT_SECRET = process.env.JWT_SECRET || 'algoverse_super_secret_jwt_key_2026';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Check if MongoDB is connected and ready
const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * Helper to validate real email addresses using standard RFC format
 */
function isValidRealEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const clean = email.trim().toLowerCase();
  return validator.isEmail(clean);
}

/**
 * 1. REGISTER ENDPOINT
 * Creates unique account with normalized email, hashed password, and initializes user state
 */
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanUsername.length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters' });
    }

    if (!isValidRealEmail(cleanEmail)) {
      return res.status(400).json({ message: 'Invalid email format. Please provide a valid email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // ── Check if Account Already Exists (MongoDB) ──
    if (isDbConnected()) {
      try {
        const existingEmailUser = await User.findOne({ email: cleanEmail }).maxTimeMS(2000);
        if (existingEmailUser) {
          return res.status(400).json({ message: 'An account with this email already exists. Please log in instead.' });
        }

        const existingUsernameUser = await User.findOne({ username: cleanUsername }).maxTimeMS(2000);
        if (existingUsernameUser) {
          return res.status(400).json({ message: 'Username is already taken' });
        }
      } catch (dbErr) {
        console.warn('[Auth Register Pre-check] MongoDB error:', dbErr.message);
      }
    }

    // ── Check if Account Already Exists (Local Persistent Storage) ──
    const existingLocalByEmail = storage.findUserByEmail(cleanEmail);
    if (existingLocalByEmail) {
      return res.status(400).json({ message: 'An account with this email already exists. Please log in instead.' });
    }

    const existingLocalByName = storage.findUserByUsername(cleanUsername);
    if (existingLocalByName) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    let createdUser = null;

    // ── 1. Create in MongoDB if connected ──
    if (isDbConnected()) {
      try {
        const newUser = new User({
          username: cleanUsername,
          email: cleanEmail,
          passwordHash,
          isVerified: true,
          activityLog: [new Date().toISOString().split('T')[0]],
          currentStreak: 1,
          longestStreak: 1,
          earnedBadges: [{ badgeId: 'welcome', name: 'Novice Coder' }],
          xp: 100
        });
        await newUser.save();
        createdUser = {
          id: newUser._id.toString(),
          _id: newUser._id.toString(),
          username: newUser.username,
          email: newUser.email,
          xp: newUser.xp,
          currentStreak: newUser.currentStreak,
          earnedBadges: newUser.earnedBadges
        };
      } catch (dbErr) {
        if (dbErr.code === 11000 || dbErr.message?.includes('duplicate key') || dbErr.message?.includes('already exists')) {
          return res.status(400).json({ message: 'An account with this email already exists. Please log in instead.' });
        }
        console.warn('[Auth Register] MongoDB save error, attempting local store fallback:', dbErr.message);
      }
    }

    // ── 2. Create in Local Storage Fallback ──
    if (!createdUser) {
      try {
        createdUser = storage.createUser({
          username: cleanUsername,
          email: cleanEmail,
          passwordHash
        });
      } catch (storageErr) {
        if (storageErr.code === 11000 || storageErr.message?.includes('already exists')) {
          return res.status(400).json({ message: 'An account with this email already exists. Please log in instead.' });
        }
        if (storageErr.code === 'USERNAME_TAKEN') {
          return res.status(400).json({ message: 'Username is already taken' });
        }
        throw storageErr;
      }
    }

    // Automatically initialize progress for the user
    storage.getProgress(createdUser.id || createdUser._id);

    // Issue JWT token so new user can immediately use platform
    const token = jwt.sign(
      { id: createdUser.id || createdUser._id, username: createdUser.username, email: createdUser.email },
      JWT_SECRET,
      { algorithm: 'HS256', expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to Code Nova.',
      token,
      user: {
        id: createdUser.id || createdUser._id,
        username: createdUser.username,
        email: createdUser.email,
        xp: createdUser.xp || 100,
        streak: createdUser.currentStreak || 1,
        earnedBadges: createdUser.earnedBadges || []
      }
    });

  } catch (error) {
    if (error.code === 11000 || error.message?.includes('duplicate key') || error.message?.includes('already exists')) {
      return res.status(400).json({ message: 'An account with this email already exists. Please log in instead.' });
    }
    console.error('[Auth Register] Internal Error:', error);
    res.status(500).json({ message: error.message || 'Registration failed. Please try again.' });
  }
});

/**
 * 2. VERIFY EMAIL ENDPOINT (GET & POST)
 * Validates cryptographic token, marks account as verified, clears token, and sends welcome email
 */
const handleEmailVerification = async (req, res) => {
  try {
    const token = req.query.token || req.body.token;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    // Compute SHA-256 hash of incoming token
    const tokenHash = crypto.createHash('sha256').update(token.trim()).digest('hex');

    // ── MongoDB Verification ──
    if (isDbConnected()) {
      try {
        const user = await User.findOne({ verificationTokenHash: tokenHash }).maxTimeMS(2000);

        if (!user) {
          return res.status(400).json({ 
            message: 'Verification link is invalid or has already been used.' 
          });
        }

        // Check expiration
        if (user.verificationTokenExpiry && new Date(user.verificationTokenExpiry) < new Date()) {
          return res.status(400).json({ 
            message: 'Verification link expired. Please request a new verification email.',
            expired: true 
          });
        }

        // Mark verified and invalidate token
        user.isVerified = true;
        user.verificationTokenHash = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save();

        // Send welcome email asynchronously
        emailService.sendWelcomeEmail({
          to: user.email,
          username: user.username
        }).catch(err => console.error('[Welcome Email Error]:', err.message));

        return res.json({
          success: true,
          message: 'Email verified successfully! You can now log in to CodeNova.'
        });
      } catch (dbErr) {
        console.warn('[Auth Verify] MongoDB error, checking local store:', dbErr.message);
      }
    }

    // ── Local Storage Fallback ──
    const localUser = storage.findUserByVerificationTokenHash(tokenHash);
    if (!localUser) {
      return res.status(400).json({ 
        message: 'Verification link is invalid or has already been used.' 
      });
    }

    if (localUser.verificationTokenExpiry && new Date(localUser.verificationTokenExpiry) < new Date()) {
      return res.status(400).json({ 
        message: 'Verification link expired. Please request a new verification email.',
        expired: true 
      });
    }

    storage.updateUser(localUser.id, {
      isVerified: true,
      verificationTokenHash: null,
      verificationTokenExpiry: null
    });

    emailService.sendWelcomeEmail({
      to: localUser.email,
      username: localUser.username
    }).catch(err => console.error('[Welcome Email Error]:', err.message));

    return res.json({
      success: true,
      message: 'Email verified successfully! You can now log in to CodeNova.'
    });

  } catch (error) {
    console.error('[Auth Verify] Error:', error);
    res.status(500).json({ message: 'Verification failed. Please try again.' });
  }
};

router.get('/verify-email', verificationLimiter, handleEmailVerification);
router.post('/verify-email', verificationLimiter, handleEmailVerification);

/**
 * 3. RESEND VERIFICATION EMAIL ENDPOINT
 * Generates fresh verification token and dispatches new email to unverified account
 */
router.post('/resend-verification', verificationLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email address is required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!isValidRealEmail(cleanEmail)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const rawVerificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenHash = crypto.createHash('sha256').update(rawVerificationToken).digest('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // ── MongoDB ──
    if (isDbConnected()) {
      try {
        const user = await User.findOne({ email: cleanEmail }).maxTimeMS(2000);
        if (!user) {
          return res.status(404).json({ message: 'Email does not exist' });
        }

        if (user.isVerified) {
          return res.status(400).json({ message: 'This account is already verified. Please sign in.' });
        }

        user.verificationTokenHash = verificationTokenHash;
        user.verificationTokenExpiry = verificationTokenExpiry;
        await user.save();

        const verificationLink = `${FRONTEND_URL}/verify-email?token=${rawVerificationToken}`;
        await emailService.sendVerificationEmail({
          to: user.email,
          username: user.username,
          verificationLink
        });

        return res.json({ message: 'A fresh verification link has been sent to your email.' });
      } catch (dbErr) {
        console.warn('[Auth Resend] MongoDB error, checking local store:', dbErr.message);
      }
    }

    // ── Local Storage Fallback ──
    const localUser = storage.findUserByEmail(cleanEmail);
    if (!localUser) {
      return res.status(404).json({ message: 'Email does not exist' });
    }

    if (localUser.isVerified) {
      return res.status(400).json({ message: 'This account is already verified. Please sign in.' });
    }

    storage.updateUser(localUser.id, {
      verificationTokenHash,
      verificationTokenExpiry: verificationTokenExpiry.toISOString()
    });

    const verificationLink = `${FRONTEND_URL}/verify-email?token=${rawVerificationToken}`;
    await emailService.sendVerificationEmail({
      to: localUser.email,
      username: localUser.username,
      verificationLink
    });

    return res.json({ message: 'A fresh verification link has been sent to your email.' });

  } catch (error) {
    console.error('[Auth Resend] Error:', error);
    res.status(500).json({ message: error.message || 'Failed to resend verification email.' });
  }
});

/**
 * 4. LOGIN ENDPOINT
 * Normalizes email, verifies hashed password against persistent record, and issues JWT session
 */
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Enforce email format
    if (!validator.isEmail(cleanEmail)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    let authenticatedUser = null;

    // ── 1. Try MongoDB Atlas ──
    if (isDbConnected()) {
      try {
        const user = await User.findOne({ email: cleanEmail }).maxTimeMS(2000);

        if (user) {
          const isMatch = await bcrypt.compare(password, user.passwordHash);
          if (isMatch) {
            authenticatedUser = {
              id: user._id.toString(),
              _id: user._id.toString(),
              username: user.username,
              email: user.email,
              xp: user.xp || 0,
              currentStreak: user.currentStreak || 0,
              earnedBadges: user.earnedBadges || []
            };
          } else {
            // Generic 401 error prevents account enumeration
            return res.status(401).json({ message: 'Invalid email or password.' });
          }
        }
      } catch (dbErr) {
        console.warn('[Auth Login] MongoDB error, checking local store:', dbErr.message);
      }
    }

    // ── 2. Check Local Persistent Storage Fallback ──
    if (!authenticatedUser) {
      const localUser = storage.findUserByEmail(cleanEmail);
      if (!localUser) {
        // Generic 401 error prevents account enumeration
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const isMatch = await bcrypt.compare(password, localUser.passwordHash);
      if (!isMatch) {
        // Generic 401 error prevents account enumeration
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      authenticatedUser = {
        id: localUser.id || localUser._id,
        _id: localUser.id || localUser._id,
        username: localUser.username,
        email: localUser.email,
        xp: localUser.xp || 0,
        currentStreak: localUser.currentStreak || 0,
        earnedBadges: localUser.earnedBadges || []
      };
    }

    const token = jwt.sign(
      { id: authenticatedUser.id, username: authenticatedUser.username, email: authenticatedUser.email }, 
      JWT_SECRET, 
      { algorithm: 'HS256', expiresIn: '7d' }
    );

    return res.json({
      message: 'Authentication successful',
      token,
      user: {
        id: authenticatedUser.id,
        username: authenticatedUser.username,
        email: authenticatedUser.email,
        xp: authenticatedUser.xp,
        streak: authenticatedUser.currentStreak,
        earnedBadges: authenticatedUser.earnedBadges
      }
    });

  } catch (error) {
    console.error('[Auth Login] Internal Error:', error);
    res.status(500).json({ message: 'Authentication failed. Please try again.' });
  }
});

/**
 * 5. CURRENT USER ENDPOINT
 * Sanitizes sensitive fields before returning user data (Protected)
 */
router.get('/me', authenticate, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    if (isDbConnected()) {
      try {
        const user = await User.findById(userId).select('-passwordHash -verificationTokenHash -verificationTokenExpiry');
        if (user) return res.json(user);
      } catch (e) {}
    }

    const localUser = storage.findUserById(userId);
    if (localUser) {
      const { passwordHash, verificationTokenHash, verificationTokenExpiry, ...safeUser } = localUser;
      return res.json(safeUser);
    }

    return res.status(404).json({ message: 'User not found' });
  } catch (err) {
    return res.status(500).json({ message: 'Error retrieving user profile' });
  }
});

/**
 * 6. LOGOUT ENDPOINT (Protected)
 * Revokes the current session JWT token on the server
 */
router.post('/logout', authenticate, (req, res) => {
  if (req.token) {
    revokeToken(req.token);
  }
  return res.json({ 
    success: true, 
    message: 'Logged out successfully. Session invalidated.' 
  });
});

module.exports = router;
