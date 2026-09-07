const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // Fixed: Added missing import
const User = require('../models/User');

// Middleware to verify logged-in user (Any role: user or admin)
const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired session' });
  }
};

// USER LOGIN
// POST /api/users/login
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body; // 'identifier' can be email or username

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Please provide email/username and password' });
    }

    // 1. Check if user exists by matching either emailAddress OR userName
    const user = await User.findOne({
      $or: [
        { emailAddress: identifier.toLowerCase().trim() },
        { userName: identifier.trim() }
      ]
    });

    console.log('user found on db', user)

    if (!user) {
      return res.status(401).json({ error: 'Invalid username/email or password' });
    }

    // 2. Compare password using the instance method on your User model
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log('Matching passwords', isMatch)
      return res.status(401).json({ error: 'Invalid username/email or password' });
    }

    // 3. Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 4. Send token in HTTP-Only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        fullName: user.fullName,
        userName: user.userName,
        emailAddress: user.emailAddress,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET PROFILE (Must be defined BEFORE /:id)
// GET /api/users/profile
router.get('/profile', requireAuth, (req, res) => {
  res.json(req.user);
});

// UPDATE PROFILE (Must be defined BEFORE /:id)
// PUT /api/users/profile
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { fullName, userName, gender } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, userName, gender },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET ALL USERS
// GET /api/users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE USER & AUTO-LOGIN
// POST /api/users
router.post('/', async (req, res) => {
  try {
    const { fullName, userName, emailAddress, password, gender, balance, role } = req.body;

    // 1. Create the new user (Password hashed via Mongoose pre-save hook)
    const newUser = await User.create({
      fullName,
      userName,
      emailAddress,
      password,
      gender,
      balance: balance ?? 0,
      role: role || 'user',
    });

    // 2. Generate a JWT token for the newly created user
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 3. Set the HTTP-Only cookie for automatic session start
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // 4. Format response without password
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: 'Account created and logged in successfully',
      user: userResponse,
    });
  } catch (err) {
    // Handle duplicate key errors (E11000 for email/username)
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({ error: `An account with that ${field} already exists.` });
    }
    res.status(400).json({ error: err.message });
  }
});

// GET USER BY ID
// GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
    res.status(500).json({ error: err.message });
  }
});

// UPDATE USER BY ID
// PUT /api/users/:id
router.put('/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData.password;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
    res.status(400).json({ error: err.message });
  }
});

// DELETE USER
// DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.deleteOne();

    res.json({ message: 'User deleted successfully', id: req.params.id });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;