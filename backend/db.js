// db.js
const mongoose = require('mongoose');


const uri = "mongodb+srv://ecocoin:muzdram80@ecocoin.uvpddte.mongodb.net/ecocoin-db?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Could not connect to MongoDB:', err);
    process.exit(1); // Останавливаем процесс в случае ошибки подключения
  }
};

module.exports = connectDB;
