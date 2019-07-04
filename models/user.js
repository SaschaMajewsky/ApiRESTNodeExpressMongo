const mongoose = require('mongoose');

// Declaration of a new user Schema for mongoDB
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('User', userSchema);
