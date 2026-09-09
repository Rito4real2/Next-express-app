// server/config/db.js
const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  // Prevent duplicate connections during hot-reloads
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  const dbUri = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;

  if (!dbUri) {
    console.error('CRITICAL: MONGO_URI is undefined in process.env!');
    return;
  }

  try {
    const db = await mongoose.connect(dbUri);
    isConnected = db.connections[0].readyState === 1;
    console.log(`MongoDB Connected: ${db.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
  }
};

module.exports = connectDB;