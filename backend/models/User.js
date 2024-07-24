const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    default: ''
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  energy: {
    type: Number,
    default: 100
  },
  step: {
    type: Number,
    default: 1
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  referrals: [
    {
      telegramId: String,
      pointsEarned: { type: Number, default: 0 }
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
