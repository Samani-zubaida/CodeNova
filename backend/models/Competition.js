const mongoose = require('mongoose');

const competitionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  dateString: { type: String, required: true },
  prizePool: { type: String },
  registrations: { type: String },
  difficulty: { type: String },
  status: { type: String, enum: ['Active', 'Upcoming', 'Completed'], default: 'Upcoming' },
  type: { type: String, enum: ['Global', 'Challenge', 'Series'], default: 'Challenge' }
}, { timestamps: true });

module.exports = mongoose.model('Competition', competitionSchema);
