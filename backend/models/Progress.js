const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  town1Unlocked: { type: Boolean, default: true },
  town2Unlocked: { type: Boolean, default: false },
  town3Unlocked: { type: Boolean, default: false },
  totalScore: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
