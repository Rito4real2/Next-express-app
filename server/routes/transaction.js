// server/routes/transaction.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { requireAdmin, requireAuth } = require('../middleware/auth');

// --- USER TRANSACTION ROUTES ---

// 1. POST /api/transaction/deposit (FIX: Added missing deposit endpoint)
router.post('/deposit', requireAuth, async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    const depositAmount = Number(amount);

    if (!depositAmount || depositAmount <= 0) {
      return res.status(400).json({ error: 'Enter a valid deposit amount' });
    }

    // Create deposit transaction with pending status
    const transaction = await Transaction.create({
      user: req.user._id,
      type: 'DEPOSIT',
      amount: depositAmount,
      status: 'PENDING',
      paymentMethod: paymentMethod || 'BANK TRANSFER',
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
      type: 'WITHDRAWAL',
      amount: withdrawAmount,
      status: 'PENDING',
      paymentMethod: paymentMethod || 'BANK TRANSFER',
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

// --- ADMIN TRANSACTION ROUTES ---

// 4. GET /api/transactions/all (Admin gets all pending or all transactions)
router.get('/all', requireAuth, requireAdmin, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('user', 'fullName userName emailAddress balance')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. PATCH /api/transactions/:id/status (Admin approve/reject transaction)
router.patch('/:id/status', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body; // 'APPROVED' or 'REJECTED'
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.status !== 'PENDING') {
      return res.status(400).json({ error: `Transaction already ${transaction.status}` });
    }

    // Handle user balance update on approval
    if (status === 'APPROVED') {
      const user = await User.findById(transaction.user);
      if (!user) return res.status(404).json({ error: 'User for this transaction not found' });

      if (transaction.type === 'DEPOSIT') {
        user.balance += transaction.amount;
      } else if (transaction.type === 'WITHDRAWAL') {
        if (user.balance < transaction.amount) {
          return res.status(400).json({ error: 'User has insufficient balance for withdrawal' });
        }
        user.balance -= transaction.amount;
      }
      await user.save();
    }

    transaction.status = status;
    await transaction.save();

    res.json({ message: `Transaction successfully ${status}`, transaction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;