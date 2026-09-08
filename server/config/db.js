const mongoose = require('mongoose');

const connectDB = async () => {
  // Check both common variable names
  const dbUri = process.env.MONGO_URI || process.env.DATABASE_URL;

  if (!dbUri) {
    console.error('CRITICAL: MongoDB connection string (MONGO_URI / DATABASE_URL) is undefined in process.env!');
    return;
  }

  try {
    const conn = await mongoose.connect(dbUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
  }
};

module.exports = connectDB;