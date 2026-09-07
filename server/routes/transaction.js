// server/routes/transaction.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Auth Middleware
const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired session' });
  }
};

// 1. MAKE A DEPOSIT (Instant Balance Addition)
// POST /api/transactions/deposit
router.post('/deposit', requireAuth, async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    const depositAmount = Number(amount);

    if (!depositAmount || depositAmount <= 0) {
      return res.status(400).json({ error: 'Enter a valid deposit amount' });
    }

    // Update user balance directly
    req.user.balance += depositAmount;
    await req.user.save();

    // Log transaction history (Auto-Approved)
    const transaction = await Transaction.create({
      user: req.user._id,
      type: 'deposit',
      amount: depositAmount,
      status: 'approved',
      paymentMethod: paymentMethod || 'Bank Transfer',
    });

    res.status(201).json({
      message: 'Deposit successful!',
      newBalance: req.user.balance,
      transaction,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. REQUEST A WITHDRAWAL (Holds Pending State)
// POST /api/transactions/withdraw
router.post('/withdraw', requireAuth, async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    const withdrawAmount = Number(amount);

    if (!withdrawAmount || withdrawAmount <= 0) {
      return res.status(400).json({ error: 'Enter a valid withdrawal amount' });
    }

    if (req.user.balance < withdrawAmount) {
      return res.status(400).json({ error: 'Insufficient account balance' });
    }

    // Create transaction with PENDING status (Admin approval needed)
    const transaction = await Transaction.create({
      user: req.user._id,
      type: 'withdrawal',
      amount: withdrawAmount,
      status: 'pending',
      paymentMethod: paymentMethod || 'Bank Transfer',
    });

    res.status(201).json({
      message: 'Withdrawal request submitted and pending admin approval.',
      transaction,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. GET USER'S TRANSACTION HISTORY
// GET /api/transactions/my-history
router.get('/my-history', requireAuth, async (req, res) => {
  try {
    const history = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;