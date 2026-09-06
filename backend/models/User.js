const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  
  // Gamification & Retention
  activityLog: [{ type: String }], // Array of "YYYY-MM-DD"
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  earnedBadges: [{ 
    badgeId: String, 
    name: String, 
    awardedAt: { type: Date, default: Date.now } 
  }],
  xp: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
