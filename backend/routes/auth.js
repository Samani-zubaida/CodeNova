const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const storage = require('../services/storage');

const JWT_SECRET = process.env.JWT_SECRET || 'algoverse_super_secret_jwt_key_2026';

// Check if MongoDB is connected and ready
const isDbConnected = () => mongoose.connection.readyState === 1;

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    if (password.length < 4) {
      return res.status(400).json({ message: 'Password must be at least 4 characters' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();

    // Check if user already exists
    if (isDbConnected()) {
      try {
        const existingUser = await User.findOne({ 
          $or: [{ email: cleanEmail }, { username: cleanUsername }] 
        }).maxTimeMS(2000);
        
        if (existingUser) {
          return res.status(400).json({ 
            message: existingUser.email === cleanEmail 
              ? 'An account with this email already exists' 
              : 'Username is already taken' 
          });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({ 
          username: cleanUsername, 
          email: cleanEmail, 
          passwordHash 
        });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id, username: newUser.username }, JWT_SECRET, { expiresIn: '7d' });

        return res.status(201).json({
          message: 'User registered successfully',
          token,
          user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            xp: newUser.xp || 0,
            streak: newUser.currentStreak || 0
          }
        });
      } catch (dbErr) {
        console.warn('[Auth Register] MongoDB error, switching to local store:', dbErr.message);
      }
    }

    // Local persistent storage fallback
    const existingByEmail = storage.findUserByEmail(cleanEmail);
    if (existingByEmail) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const existingByName = storage.findUserByUsername(cleanUsername);
    if (existingByName) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = storage.createUser({
      username: cleanUsername,
      email: cleanEmail,
      passwordHash
    });

    const token = jwt.sign({ id: newUser.id, username: newUser.username }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        xp: newUser.xp || 0,
        streak: newUser.currentStreak || 0
      }
    });

  } catch (error) {
    console.error('[Auth Register] Internal Error:', error);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Try MongoDB if connected
    if (isDbConnected()) {
      try {
        const user = await User.findOne({ 
          $or: [{ email: cleanEmail }, { username: cleanEmail }] 
        }).maxTimeMS(2000);

        if (user) {
          const isMatch = await bcrypt.compare(password, user.passwordHash);
          if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
          }

          const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

          return res.json({
            message: 'Authentication successful',
            token,
            user: {
              id: user._id,
              username: user.username,
              email: user.email,
              xp: user.xp || 0,
              streak: user.currentStreak || 0
            }
          });
        }
      } catch (dbErr) {
        console.warn('[Auth Login] MongoDB error, checking local store:', dbErr.message);
      }
    }

    // 2. Check Local Persistent Storage
    const localUser = storage.findUserByEmail(cleanEmail) || storage.findUserByUsername(cleanEmail);
    if (!localUser) {
      return res.status(400).json({ message: 'No account found with this email or username' });
    }

    const isMatch = await bcrypt.compare(password, localUser.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect passcode entered' });
    }

    const token = jwt.sign({ id: localUser.id || localUser._id, username: localUser.username }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      message: 'Authentication successful',
      token,
      user: {
        id: localUser.id || localUser._id,
        username: localUser.username,
        email: localUser.email,
        xp: localUser.xp || 0,
        streak: localUser.currentStreak || 0
      }
    });

  } catch (error) {
    console.error('[Auth Login] Internal Error:', error);
    res.status(500).json({ message: 'Authentication failed. Please try again.' });
  }
});

// Current User endpoint
router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (isDbConnected()) {
      try {
        const user = await User.findById(decoded.id).select('-passwordHash');
        if (user) return res.json(user);
      } catch (e) {}
    }

    const localUser = storage.findUserById(decoded.id);
    if (localUser) {
      const { passwordHash, ...safeUser } = localUser;
      return res.json(safeUser);
    }

    return res.status(404).json({ message: 'User not found' });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

module.exports = router;
