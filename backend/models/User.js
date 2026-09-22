const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },

  // Verification & Security
  isVerified: { type: Boolean, default: false },
  verificationTokenHash: { type: String, default: null },
  verificationTokenExpiry: { type: Date, default: null },

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

// Ensure sensitive fields are never exposed in JSON output
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    delete ret.verificationTokenHash;
    delete ret.verificationTokenExpiry;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);
