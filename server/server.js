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
      // Allow requests with no origin (like server-to-server or Postman)
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      return callback(new Error('CORS policy error'), false);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB lazily per request
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/transaction', transactionRoute);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Express backend is connected!',
    dataBaseConfigured: Boolean(process.env.MONGO_URI || process.env.DATABASE_URL || process.env.MONGODB_URI)
  });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}`);
  });
}

module.exports = app;