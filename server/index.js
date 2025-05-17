const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // For accessing environment variables
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const User = require('./models/User')

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
// Login Route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find the user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('User not found');

    // Check password (Note: in production, use bcrypt)
    if (user.password !== password) return res.status(400).send('Invalid credentials');

    // Return basic user info
    res.status(200).json({
      email: user.email,
      name: user.name,
      college: user.college,
      branch: user.branch,
      semester: user.semester
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Home route
// Add this to index.js or a separate route file
app.get('/api/auth/profile/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).send('User not found');

    const { name, college, branch } = user;
    res.json({ name, college, branch });
  } catch (err) {
    res.status(500).send('Server error');
  }
});


// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI)

// .then(() => console.log('MongoDB Connected'))
// .catch((err) => console.error('MongoDB Error:', err));

// // Server listening on port 5000
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });






// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/studentDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Signup Route
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, college, branch, semester } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send('Email already exists');

    const newUser = new User({ name, email, password, college, branch, semester });
    await newUser.save();
    res.status(200).send('Signup successful');
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
