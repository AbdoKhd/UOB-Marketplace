const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Create a new user
router.post('/register', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(200).json({message: 'Registration Successful', newUser});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Authentication
router.post('/login', async (req, res) => {
  try{
    const {username, password} = req.body;

    const user = await User.findOne({username});
    if(!user){
      return res.status(400).json({message: 'Invalid username'})
    }

    const isMatch = await user.comparePassword(password)
    if(!isMatch){
      return res.status(400).json({message: 'Invalid password'})
    }

    res.status(200).json({message: 'Login Successful', user: {id: user.id, name: user.username, email: user.email}})


  }catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
