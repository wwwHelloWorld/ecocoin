const mongoose = require('./db');
const User = require('./models/User');

const testData = [
  { userId: 1, totalPoints: 150, status: 'active', dailyBoosts: true },
  { userId: 2, totalPoints: 300, status: 'inactive', dailyBoosts: false },
  { userId: 3, totalPoints: 450, status: 'active', dailyBoosts: true },
  { userId: 4, totalPoints: 600, status: 'inactive', dailyBoosts: false },
  { userId: 5, totalPoints: 750, status: 'active', dailyBoosts: true }
];

async function seedDatabase() {
  try {
    await User.deleteMany(); // Очистка коллекции перед добавлением тестовых данных
    await User.insertMany(testData);
    console.log('Test data inserted successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error inserting test data', error);
    mongoose.connection.close();
  }
}

seedDatabase();
