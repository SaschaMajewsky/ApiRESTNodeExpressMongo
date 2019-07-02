const express = require('express');
const router = express.Router();
const User = require('../models/user');

//Getting All Users
router.get('/', async (req, res) => {
  try {
    //search all mongoDB users
    const users = await User.find();
    res.json(users);
  } catch (err) {
    //when a problem occurs a JSON should be communicated back and admitted that backend did wrong
    res.status(500).json({ message: err.message });
  }
});
//Getting One User

//:id stands for paramer and can by accessed by req.params
router.get('/:id', getUsers, (req, res) => {
  res.json(res.user);
});

//Creating One User
router.post('/', async (req, res) => {
  const user = new User({
    name: req.body.name,
    todos: req.body.todos,
  });

  try {
    //When the new user can be successfully saved to DB it is in the variable
    //HTTP Status 201 will be returned along with the created userobject
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    //when a problem occurs a JSON should be communicated back and admitted that user provided was bad
    res.status(400).json({ message: err.message });
  }
});

//Updating One User
//Patch instead of Put because only the provided fields should be updated not the whole user
router.patch('/:id', getUsers, async (req, res) => {
  if (req.body.name != null) {
    res.user.name = req.body.name;
  }

  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch {
    res.status(400).json({ message: err.message });
  }
});

//Deleting One User
router.delete('/:id', getUsers, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: 'Deleted User' });
  } catch {
    res.status(500).json({ message: err.message });
  }
});

//Middleware for the other route functions to use
async function getUsers(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    console.log('GRABBED USER: ', user);
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find User' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  //setting the found user to the response variable user
  res.user = user;

  //will continue to the next middleware or the request itself
  next();
}

module.exports = router;
