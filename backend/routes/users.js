// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Маршрут для получения рефералов по telegramId
router.get('/referrals/:telegramId', async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.referrals);
  } catch (error) {
    console.error('Error fetching referrals:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
