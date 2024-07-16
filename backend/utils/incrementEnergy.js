const User = require('../models/User');
const io = require('../server').io; // импортируем io из основного файла сервера

const incrementEnergy = async () => {
  try {
    const users = await User.find({});
    for (let user of users) {
      if (user.energy < 100) {
        user.energy = Math.min(user.energy + 1, 100);
        await user.save();
        io.emit('updateEnergy', { userId: user.telegramId, energy: user.energy });
      }
    }
  } catch (error) {
    console.error('Error updating energy:', error);
  }
};

module.exports = incrementEnergy;
