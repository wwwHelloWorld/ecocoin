const { Telegraf } = require('telegraf');
const User = require('./models/User');

const token = "7132940402:AAGIX0vRObhPJCNem3KYGVHjDlsMGggUK00";

const bot = new Telegraf(token);

bot.start(async (ctx) => {
  const telegramId = ctx.from.id;
  const referrerTelegramId = ctx.message.text.split(' ')[1]; // получаем ID реферала из текста сообщения

  try {
    let user = await User.findOne({ telegramId });
    const currentTime = new Date();

    if (!user) {
      // Если пользователь не найден, создаем нового
      user = new User({
        telegramId,
        username: ctx.from.username || '',
        totalPoints: 0,
        energy: 100,
        step: 1,
        lastLogin: currentTime
      });

      await user.save().catch(err => console.error('Error saving user:', err));

      // Проверка и запись информации о реферале
      if (referrerTelegramId) {
        const referrer = await User.findOne({ telegramId: referrerTelegramId });
        if (referrer) {
          referrer.referrals.push({ telegramId: user.telegramId, userName: user.username });
          await referrer.save().catch(err => console.error('Error saving referrer:', err));
        }
      }
    } else {
      // Если пользователь уже существует, проверяем и записываем реферала
      if (referrerTelegramId) {
        const referrer = await User.findOne({ telegramId: referrerTelegramId });
        if (referrer) {
          // Проверяем, чтобы реферал не добавлялся несколько раз
          const alreadyReferred = referrer.referrals.some(ref => ref.telegramId === user.telegramId);
          if (!alreadyReferred) {
            referrer.referrals.push({ telegramId: user.telegramId, userName: user.username });
            await referrer.save().catch(err => console.error('Error saving referrer:', err));
          }
        }
      }
    }

    ctx.reply('Welcome! Your referral has been recorded' + (referrerTelegramId ? `, and ${referrerTelegramId} has been notified.` : ''));
  } catch (error) {
    console.error('Error processing request:', error);
    ctx.reply('An error occurred while processing your request. Please try again later.');
  }
});

bot.launch();

// Handle graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.exports = bot;
