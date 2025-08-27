const mongoose = require('mongoose');
require('dotenv').config();

async function connectToDatabase() {
  const mongoUri = process.env.MONGO_URI;
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, {
    autoIndex: true,
  });
  // eslint-disable-next-line no-console
  console.log('MongoDB connected');
}

module.exports = { connectToDatabase };


