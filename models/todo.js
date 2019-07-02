const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  todo: [
    {
      user: { type: String, required: true },
      title: { type: String, required: true, unique: true },
      category: { type: String, default: 'all' },
      status: { type: String, required: true, default: false },
      text: { type: String },
      date: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
