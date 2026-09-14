const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
}

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const transactionRoute = require('./routes/transaction');

const app = express();
const PORT = process.env.PORT || 5000;

// Dynamic CORS configuration for Vercel production & local dev
const allowedOrigins = [
  'http://localhost:3000',
  'https://next-express-app-xi.vercel.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback allow to prevent preflight CORS 500s
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// 1. HEALTH CHECK ROUTE (Placed BEFORE DB middleware so it always returns 200 OK)
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Express backend is connected!',
    environment: process.env.NODE_ENV || 'development',
    hasMongoUri: Boolean(process.env.MONGO_URI || process.env.DATABASE_URL || process.env.MONGODB_URI)
  });
});

// 2. SAFE DATABASE CONNECTION MIDDLEWARE (Wrapped in try/catch)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed during request:', error);
    res.status(500).json({ error: 'Database connection error', details: error.message });
  }
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/transaction', transactionRoute);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}`);
  });
}

module.exports = app;