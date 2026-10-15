const Progress = require('../models/Progress');

exports.getProgress = async (req, res) => {
  try {
    let progress = await Progress.findOne({ userId: req.user.id });
    if (!progress) {
      progress = new Progress({ userId: req.user.id });
      await progress.save();
    }
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { score, town2Unlocked, town3Unlocked } = req.body;
    let progress = await Progress.findOne({ userId: req.user.id });
    
    if (!progress) {
      progress = new Progress({ userId: req.user.id });
    }

    if (score) progress.totalScore += score;
    if (town2Unlocked !== undefined) progress.town2Unlocked = town2Unlocked;
    if (town3Unlocked !== undefined) progress.town3Unlocked = town3Unlocked;

    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
