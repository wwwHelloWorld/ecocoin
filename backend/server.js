const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectDB = require('./db');
const User = require('./models/User');
const updateStep = require('./utils/updateStep.js');
const userRoutes = require('./routes/users.js');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  }
});

module.exports.io = io;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

const calculatePointsToAdd = (lastLogin, currentTime, step) => {
  const elapsedSeconds = Math.floor((currentTime - lastLogin) / 1000);
  return Math.floor(elapsedSeconds / 10) * step;
};

const calculateEnergyToAdd = (lastLogin, currentTime) => {
  const elapsedSeconds = Math.floor((currentTime - lastLogin) / 1000);
  return Math.min(Math.floor(elapsedSeconds / 10), 100);
};

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('getUserData', async (telegramId) => {
    try {
      let user = await User.findOne({ telegramId });
      const currentTime = new Date();

      if (!user) {
        user = new User({
          telegramId,
          totalPoints: 0,
          energy: 100,
          step: 1,
          lastLogin: currentTime
        });
        await user.save();
      } else {
        const lastLogin = user.lastLogin || currentTime;
        const pointsToAdd = calculatePointsToAdd(lastLogin, currentTime, user.step);
        user.totalPoints += pointsToAdd;

        const energyToAdd = calculateEnergyToAdd(lastLogin, currentTime);
        user.energy = Math.min(user.energy + energyToAdd, 100);

        user.step = updateStep(user.totalPoints);
        user.lastLogin = currentTime;

        await user.save();

        socket.emit('botTapPoints', { pointsToAdd, totalPoints: user.totalPoints });
        console.log("POint to add", user.telegramId, pointsToAdd);
        console.log(user.telegramId,user.energy);
      }

      socket.emit('userData', {
        telegramId: user.telegramId,
        totalPoints: user.totalPoints,
        energy: user.energy,
        step: user.step
      });
    } catch (error) {
      console.error('Error fetching or creating user:', error);
    }
  });

  socket.on('incrementCount', async ({ userId, step }) => {
    try {
      const user = await User.findOneAndUpdate(
        { telegramId: userId },
        { $inc: { totalPoints: step } },
        { new: true }
      );
      if (user) {
        user.step = updateStep(user.totalPoints);
        await user.save();
        io.emit('updateCount', { userId: user.telegramId, totalPoints: user.totalPoints });
        console.log("Count", user.telegramId, user.totalPoints)
      }
    } catch (error) {
      console.error('Error updating count:', error);
    }
  });

  socket.on('addEnergy', async ({ userId, energy }) => {
    try {
      const user = await User.findOneAndUpdate(
        { telegramId: userId },
        { $set: { energy } },
        { new: true }
      );
      if (user) {
        io.emit('updateEnergy', { userId: user.telegramId, energy: user.energy });
        console.log("Update energy", user.telegramId, user.energy)
      }
    } catch (error) {
      console.error('Error updating energy:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
