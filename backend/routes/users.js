// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

const app = express();

// Получение рефералов пользователя
app.get('/api/referrals', async (req, res) => {
  const { telegramId } = req.query;
  try {
    // Fetch referrals from database
    const referrals = await getReferralsFromDatabase(telegramId);
    res.json(referrals);
  } catch (error) {
    console.error('Error fetching referrals:', error);
    res.status(500).send('Server error');
  }
});

async function getReferralsFromDatabase(telegramId) {
  // Implement database fetching logic here
  return [
    { id: 1, username: 'user1', points: 100 },
    { id: 2, username: 'user2', points: 150 },
    // Add more referral data as needed
  ];
}

module.exports = router;
