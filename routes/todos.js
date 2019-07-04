const express = require('express');
const router = express.Router();
const Todo = require('../models/todo');

// Request to get all todos and return them as JSON
router.get('/', async (req, res) => {
  try {
    // Search all mongoDB todos
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    // When a problem occurs a JSON the message is communicated back and admitted that backend did wrong
    res.status(500).json({ message: err.message });
  }
});

/* Request to get on specific todo by ID and return it as JSON
:id stands for parameter and can by accessed by req.params
getTodos middleware is used to help with DRY-principle */
router.get('/:id', getTodos, (req, res) => {
  res.json(res.todo);
});

// Request to create a new todo and return it as JSON
router.post('/', async (req, res) => {
  const todo = new Todo({
    user: req.body.user,
    text: req.body.text,
  });

  try {
    /* When the new todo can be successfully saved to DB it gets async saved in the newTodo variable
    HTTP Status 201 will be returned along with the new created todo object */
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    // When a problem occurs a JSON message should be communicated back and admitted that the provided todo input was bad
    res.status(400).json({ message: err.message });
  }
});

/* Request to update one specific todo by ID and return the updated todo object as JSON
Patch instead of Put because only the provided fields should be updated not the whole todo */
router.patch('/:id', getTodos, async (req, res) => {
  if (req.body.user != null) {
    res.todo.user = req.body.user;
  }
  if (req.body.text != null) {
    res.todo.text = req.body.text;
  }
  if (req.body.status != null) {
    res.todo.status = req.body.status;
  }
  if (req.body.date != null) {
    res.todo.date = req.body.date;
  }

  try {
    const updatedTodo = await res.todo.save();
    res.json(updatedTodo);
  } catch {
    res.status(400).json({ message: err.message });
  }
});

// Request to delete one todo by ID and return the deleted todo object as JSON
router.delete('/:id', getTodos, async (req, res) => {
  try {
    await res.todo.remove();
    res.json({ message: 'Deleted Todo', todo: res.todo });
  } catch {
    res.status(500).json({ message: err.message });
  }
});

// Middleware for other todoByID requests to utilize to keep code clean
async function getTodos(req, res, next) {
  let todo;
  try {
    todo = await Todo.findById(req.params.id);
    if (todo == null) {
      return res.status(404).json({ message: 'Cannot find Todo' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  // Response variable todo assigned to the found todo
  res.todo = todo;

  // next() continues to the next middleware or the request itself when used in another function
  next();
}

module.exports = router;
