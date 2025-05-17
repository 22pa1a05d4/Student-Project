
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');

// SIGNUP Route
router.post('/signup', async (req, res) => {
  const { name, email, password, college, branch, semester } = req.body;
  try {
    // Check for duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send('Email already registered');

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      college,
      branch,
      semester
    });

    await newUser.save();
    res.status(201).send('User registered successfully');
  } catch (err) {
    console.error('Signup Error:', err.message);
    res.status(500).send(`Error registering user: ${err.message}`);
  }
});

// LOGIN Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Invalid email or password');

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid email or password');

    // Success
    
res.status(200).json({ message: 'Login successful', email: user.email });

  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).send(`Server error: ${err.message}`);
  }
});

// GET user profile by email
router.get('/profile/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('User not found');

    const { name, college, branch } = user;
    res.status(200).json({ name, college, branch });
  } catch (err) {
    console.error('Profile Fetch Error:', err.message);
    res.status(500).send(`Error fetching user: ${err.message}`);
  }
});


module.exports = router;
