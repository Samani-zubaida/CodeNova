const mongoose = require('mongoose');

const competitionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  hostOrg: { type: String, required: true, default: 'Nova Core' },
  startTime: { type: Date },
  endTime: { type: Date },
  dateString: { type: String }, // Legacy/display field
  prizePool: { type: String },
  difficulty: { type: String },
  status: { type: String, enum: ['Active', 'Upcoming', 'Completed'], default: 'Upcoming' },
  type: { type: String, enum: ['Global', 'Challenge', 'Series', 'Hosted'], default: 'Challenge' },
  
  // Organization Hosted Specifics
  questions: [{
    title: String,
    description: String,
    initialCode: String,
    testCases: [{
      input: String,
      expectedOutput: String
    }]
  }],
  participants: [{
    username: String,
    score: Number,
    submissionTime: Date
  }]
}, { timestamps: true });

module.exports = mongoose.model('Competition', competitionSchema);
