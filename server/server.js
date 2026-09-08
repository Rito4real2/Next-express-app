const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const connectDB = require('./config/db')
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user')
const transactionRoute = require('./routes/transaction')

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB()

// Allow requests from Next.js dev server
app.use(cors({ origin: ['http://localhost:3000', 'https://next-express-app-xi.vercel.app'], credentials: true, }));
app.use(express.json());
app.use(cookieParser()); // Enable cookie parsing

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/transaction', transactionRoute)

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Express backend is connected!',
    dataBaseConfigured: Boolean(DATABASE_URL)
});
});

// // Example API route
// app.get('/api/products', (req, res) => {
//   res.json([
//     { id: 1, title: 'Next.js + Express Starter Kit', price: 29 },
//     { id: 2, title: 'Fullstack Mastery Guide', price: 49 }
//   ]);
// });

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});