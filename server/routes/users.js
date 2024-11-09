const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Create a new user
router.post('/register', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(200).json({message: 'Registration Successful', user: {id: newUser.id, firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email}});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Authentication
router.post('/login', async (req, res) => {
  try{
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({message: 'Invalid email'})
    }

    const isMatch = await user.comparePassword(password)
    if(!isMatch){
      return res.status(400).json({message: 'Invalid password'})
    }

    res.status(200).json({message: 'Login Successful', user: {id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email}})


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
