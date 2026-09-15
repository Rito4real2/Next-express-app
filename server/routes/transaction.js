// server/routes/transaction.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { requireAdmin } = require('../middleware/auth');

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

// --- USER TRANSACTION ROUTES ---

// 1. POST /api/transactions/deposit
router.post('/deposit', requireAuth, async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    const depositAmount = Number(amount);

    if (!depositAmount || depositAmount <= 0) {
      return res.status(400).json({ error: 'Enter a valid deposit amount' });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      type: 'deposit',
      amount: depositAmount,
      status: 'pending',
      paymentMethod: paymentMethod || 'Credit/Debit Card',
    });

    res.status(201).json({
      message: 'Deposit request submitted and pending admin approval.',
      transaction,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. POST /api/transactions/withdraw
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

// 3. GET /api/transactions/my-history
router.get('/my-history', requireAuth, async (req, res) => {
  try {
    const history = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ADMIN TRANSACTION ROUTES ---

// 4. GET /api/transactions/all (Supports Optional ?status=pending|approved|rejected)
router.get('/all', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      filter.status = status;
    }

    const transactions = await Transaction.find(filter)
      .populate('user', 'fullName userName emailAddress balance')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. PATCH /api/transactions/:id/status (Approve/Reject + Atomic Balance Update)
router.patch('/:id/status', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status provided' });
    }

    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({ error: `Transaction is already ${transaction.status}` });
    }

    let updatedUser = null;

    // Handle user balance update on approval
    if (status === 'approved') {
      const user = await User.findById(transaction.user);
      if (!user) return res.status(404).json({ error: 'User for this transaction not found' });

      if (transaction.type === 'deposit') {
        user.balance += transaction.amount;
      } else if (transaction.type === 'withdrawal') {
        if (user.balance < transaction.amount) {
          return res.status(400).json({ error: 'User has insufficient balance to approve this withdrawal' });
        }
        user.balance -= transaction.amount;
      }

      updatedUser = await user.save();
    }

    transaction.status = status;
    await transaction.save();

    // Re-populate user details for consistent UI response
    const populatedTransaction = await Transaction.findById(transaction._id).populate(
      'user',
      'fullName userName emailAddress balance'
    );

    res.json({
      message: `Transaction successfully ${status}`,
      transaction: populatedTransaction,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;