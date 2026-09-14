const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  const dbUri = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;

  if (!dbUri) {
    throw new Error('MONGO_URI environment variable is missing on Vercel!');
  }

  try {
    const db = await mongoose.connect(dbUri, {
      bufferCommands: false, // Disable Mongoose buffering in serverless
    });
    isConnected = db.connections[0].readyState === 1;
    console.log(`MongoDB Connected: ${db.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error; // Re-throw to be caught safely by server.js middleware
  }
};

module.exports = connectDB;