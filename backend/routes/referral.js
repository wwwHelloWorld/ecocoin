// routes/referral.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', async (req, res) => {
  const { start: referrerTelegramId } = req.query;

  if (referrerTelegramId) {
    try {
      const referrer = await User.findOne({ telegramId: referrerTelegramId });

      if (referrer) {
        referrer.referrals.push({ telegramId: null, pointsEarned: 0 }); // Placeholder for now
        await referrer.save();
        console.log('Referral added:', referrerTelegramId);
      }
    } catch (error) {
      console.error('Error saving referral:', error);
    }
  }

  // Redirect the user to the main app page
  res.redirect('/');
});

module.exports = router;
