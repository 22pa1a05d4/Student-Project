
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  college: String,
  branch: String,
  semester: Number,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
