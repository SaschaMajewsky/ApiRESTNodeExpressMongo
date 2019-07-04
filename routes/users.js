const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Request to get all users and return them as JSON
router.get('/', async (req, res) => {
  try {
    // Search all mongoDB users
    const users = await User.find();
    res.json(users);
  } catch (err) {
    // When a problem occurs a JSON the message is communicated back and admitted that backend did wrong
    res.status(500).json({ message: err.message });
  }
});

/* Request to get on specific user by ID and return it as JSON
:id stands for parameter and can by accessed by req.params 
getUsers middleware is used to help with DRY-principle */
router.get('/:id', getUsers, (req, res) => {
  res.json(res.user);
});

// Request to create a new user and return it as JSON
router.post('/', async (req, res) => {
  const user = new User({
    name: req.body.name,
  });

  try {
    /* When the new user can be successfully saved to DB it gets async saved in the newUser variable
    HTTP Status 201 will be returned along with the new created user object */
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    // When a problem occurs a JSON message should be communicated back and admitted that the provided user input was bad
    res.status(400).json({ message: err.message });
  }
});

/* Request to update one specific user by ID and return the updated user object as JSON
Patch instead of Put because only the provided fields should be updated not the whole user */
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

// Request to delete one user by ID and return the deleted user object as JSON
router.delete('/:id', getUsers, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: 'Deleted User', user: res.user });
  } catch {
    res.status(500).json({ message: err.message });
  }
});

// Middleware for other userByID requests to utilize to keep code clean
async function getUsers(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find User' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  // Response variable user assigned to the found user
  res.user = user;

  // next() continues to the next middleware or the request itself when used in another function
  next();
}

module.exports = router;
