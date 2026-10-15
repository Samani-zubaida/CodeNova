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

const JWT_SECRET = process.env.JWT_SECRET || 'algoverse_super_secret_jwt_key_2026';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Check if MongoDB is connected and ready
const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * Helper to validate real email addresses & reject dummy strings
 */
function isValidRealEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const clean = email.trim().toLowerCase();

  // Basic RFC validation requiring proper domain & TLD
  if (!validator.isEmail(clean, { allow_utf8_local_part: false, require_tld: true })) {
    return false;
  }

  const parts = clean.split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;

  // Domain structure checks
  if (!domain || !domain.includes('.')) return false;
  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];
  if (!tld || tld.length < 2) return false;

  // Reject placeholder / fake domains
  const blacklistedDomains = ['test', 'abc', 'localhost', 'invalid', 'example.com', 'test.com', 'fake.com', 'sample.com'];
  if (blacklistedDomains.includes(domain)) return false;

  // Reject placeholder local names on generic domain
  const blacklistedLocals = ['test', 'abc', 'dummy', 'fake'];
  if (blacklistedLocals.includes(local) && domainParts.length <= 2) return false;

  return true;
}

/**
 * 1. REGISTER ENDPOINT
 * Creates account with isVerified: false, hashes token, and sends verification email
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
      return res.status(400).json({ message: 'Invalid email format. Please provide a real email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Generate secure random verification token & hash
    const rawVerificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenHash = crypto.createHash('sha256').update(rawVerificationToken).digest('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // ── MongoDB Persistence ──
    if (isDbConnected()) {
      try {
        const existingEmailUser = await User.findOne({ email: cleanEmail }).maxTimeMS(2000);
        if (existingEmailUser) {
          // If already verified, do not allow duplicate
          if (existingEmailUser.isVerified) {
            return res.status(400).json({ message: 'An account with this email already exists' });
          }

          // If unverified, refresh credentials & verification token
          existingEmailUser.username = cleanUsername;
          existingEmailUser.passwordHash = passwordHash;
          existingEmailUser.verificationTokenHash = verificationTokenHash;
          existingEmailUser.verificationTokenExpiry = verificationTokenExpiry;
          await existingEmailUser.save();

          const verificationLink = `${FRONTEND_URL}/verify-email?token=${rawVerificationToken}`;
          await emailService.sendVerificationEmail({
            to: cleanEmail,
            username: cleanUsername,
            verificationLink
          });

          return res.status(201).json({
            message: 'Verification email sent! Please check your inbox to activate your account.',
            emailSent: true,
            email: cleanEmail
          });
        }

        const existingUsernameUser = await User.findOne({ username: cleanUsername }).maxTimeMS(2000);
        if (existingUsernameUser) {
          return res.status(400).json({ message: 'Username is already taken' });
        }

        const newUser = new User({
          username: cleanUsername,
          email: cleanEmail,
          passwordHash,
          isVerified: false,
          verificationTokenHash,
          verificationTokenExpiry
        });
        await newUser.save();

        const verificationLink = `${FRONTEND_URL}/verify-email?token=${rawVerificationToken}`;
        await emailService.sendVerificationEmail({
          to: cleanEmail,
          username: cleanUsername,
          verificationLink
        });

        return res.status(201).json({
          message: 'Registration successful! Please check your email to verify your account.',
          emailSent: true,
          email: cleanEmail
        });
      } catch (dbErr) {
        console.warn('[Auth Register] MongoDB error, attempting local store fallback:', dbErr.message);
      }
    }

    // ── Local Storage Fallback ──
    const existingByEmail = storage.findUserByEmail(cleanEmail);
    if (existingByEmail) {
      if (existingByEmail.isVerified) {
        return res.status(400).json({ message: 'An account with this email already exists' });
      }

      // Refresh verification token for unverified local user
      storage.updateUser(existingByEmail.id, {
        username: cleanUsername,
        passwordHash,
        verificationTokenHash,
        verificationTokenExpiry: verificationTokenExpiry.toISOString()
      });

      const verificationLink = `${FRONTEND_URL}/verify-email?token=${rawVerificationToken}`;
      await emailService.sendVerificationEmail({
        to: cleanEmail,
        username: cleanUsername,
        verificationLink
      });

      return res.status(201).json({
        message: 'Verification email sent! Please check your inbox to activate your account.',
        emailSent: true,
        email: cleanEmail
      });
    }

    const existingByName = storage.findUserByUsername(cleanUsername);
    if (existingByName) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    storage.createUser({
      username: cleanUsername,
      email: cleanEmail,
      passwordHash,
      isVerified: false,
      verificationTokenHash,
      verificationTokenExpiry: verificationTokenExpiry.toISOString()
    });

    const verificationLink = `${FRONTEND_URL}/verify-email?token=${rawVerificationToken}`;
    await emailService.sendVerificationEmail({
      to: cleanEmail,
      username: cleanUsername,
      verificationLink
    });

    return res.status(201).json({
      message: 'Registration successful! Please check your email to verify your account.',
      emailSent: true,
      email: cleanEmail
    });

  } catch (error) {
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
 * Enforces email format, email existence, correct password, and verified email status
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

    // ── 1. Try MongoDB Atlas ──
    if (isDbConnected()) {
      try {
        const user = await User.findOne({ email: cleanEmail }).maxTimeMS(2000);

        if (!user) {
          return res.status(404).json({ message: 'Email does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
          return res.status(401).json({ message: 'Incorrect password' });
        }

        // Email Verification Check (grandfather existing users whose isVerified is undefined)
        if (user.isVerified === false) {
          return res.status(403).json({ 
            message: 'Email not verified. Please verify your email before logging in.',
            emailNotVerified: true,
            email: user.email
          });
        }

        const token = jwt.sign(
          { id: user._id, username: user.username, email: user.email }, 
          JWT_SECRET, 
          { expiresIn: '7d' }
        );

        return res.json({
          message: 'Authentication successful',
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            xp: user.xp || 0,
            streak: user.currentStreak || 0,
            earnedBadges: user.earnedBadges || []
          }
        });
      } catch (dbErr) {
        console.warn('[Auth Login] MongoDB error, checking local store:', dbErr.message);
      }
    }

    // ── 2. Check Local Persistent Storage Fallback ──
    const localUser = storage.findUserByEmail(cleanEmail);
    if (!localUser) {
      return res.status(404).json({ message: 'Email does not exist' });
    }

    const isMatch = await bcrypt.compare(password, localUser.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    if (localUser.isVerified === false) {
      return res.status(403).json({ 
        message: 'Email not verified. Please verify your email before logging in.',
        emailNotVerified: true,
        email: localUser.email
      });
    }

    const token = jwt.sign(
      { id: localUser.id || localUser._id, username: localUser.username, email: localUser.email }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Authentication successful',
      token,
      user: {
        id: localUser.id || localUser._id,
        username: localUser.username,
        email: localUser.email,
        xp: localUser.xp || 0,
        streak: localUser.currentStreak || 0,
        earnedBadges: localUser.earnedBadges || []
      }
    });

  } catch (error) {
    console.error('[Auth Login] Internal Error:', error);
    res.status(500).json({ message: 'Authentication failed. Please try again.' });
  }
});

/**
 * 5. CURRENT USER ENDPOINT
 * Sanitizes sensitive fields before returning user data
 */
router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (isDbConnected()) {
      try {
        const user = await User.findById(decoded.id).select('-passwordHash -verificationTokenHash -verificationTokenExpiry');
        if (user) return res.json(user);
      } catch (e) {}
    }

    const localUser = storage.findUserById(decoded.id);
    if (localUser) {
      const { passwordHash, verificationTokenHash, verificationTokenExpiry, ...safeUser } = localUser;
      return res.json(safeUser);
    }

    return res.status(404).json({ message: 'User not found' });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

module.exports = router;
