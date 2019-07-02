const express = require('express');
const router = express.Router();
const Todo = require('../models/todo');

//Getting All Todos
router.get('/', async (req, res) => {
  try {
    //search all mongoDB todos
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    //when a problem occurs a JSON should be communicated back and admitted that backend did wrong
    res.status(500).json({ message: err.message });
  }
});

//Getting One Todo
//:id stands for parameter and can by accessed by req.params
router.get('/:id', getTodos, (req, res) => {
  res.json(res.todo);
});

//Creating One Todo
router.post('/', async (req, res) => {
  const todo = new Todo({
    user: req.body.user,
    text: req.body.text,
  });

  try {
    //When the new Todo can be successfully saved to DB it is in the variable
    //HTTP Status 201 will be returned along with the created todoobject
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    //when a problem occurs a JSON should be communicated back and admitted that user provided was bad
    res.status(400).json({ message: err.message });
  }
});

//Updating One Todo
//Patch instead of Put because only the provided fields should be updated not the whole todo
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

//Deleting One Todo
router.delete('/:id', getTodos, async (req, res) => {
  try {
    await res.todo.remove();
    res.json({ message: 'Deleted Todo' });
  } catch {
    res.status(500).json({ message: err.message });
  }
});

//Middleware for the other route functions to use
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
  //setting the found todo to the response variable todo
  res.todo = todo;

  //will continue to the next middleware or the request itself
  next();
}

module.exports = router;
