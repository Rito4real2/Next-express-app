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

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);

      // Dynamically allow any .vercel.app deployment or localhost
      if (
        origin.endsWith(".vercel.app") ||
        origin.includes("localhost")
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // Crucial for HTTP-Only cookies with credentials: 'include'
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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