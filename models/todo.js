const mongoose = require('mongoose');

// Declaration of a new todo Schema for mongoDB
const todoSchema = new mongoose.Schema({
  user: { type: String, required: true },
  text: { type: String, required: true },
  status: { type: Boolean, required: true, default: false },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Todo', todoSchema);
