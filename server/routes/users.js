const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Create a new user
router.post('/register', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(200).json({message: 'Registration Successful', loggedInUserId: newUser.id });
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

    res.status(200).json({message: 'Login Successful', loggedInUserId: user.id});


  }catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Route to get a user
router.get('/getUser/:userId', async (req, res) =>{

  const {userId} = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: `User not found` });
    }

    res.status(200).json({message: `Fetched user successfully`, user: {id: user.id, firstName: user.firstName, 
      lastName: user.lastName, email: user.email, about: user.about, campus: user.campus, profilePictureKey: user.profilePictureKey, 
      myListings: user.myListings, myFavorites: user.myFavorites}});

  } catch (error) {
    res.status(500).json({ message: `An error occurred while fetching the user`, error });
  }
})

// Route to edit a user
router.put('/editUser/:userId', async (req, res) => {
  const { userId } = req.params;
  const { profilePictureKey, firstName, lastName, campus } = req.body;

  try {

    // Find the user by ID and update the fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, campus, profilePictureKey },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: `User not found` });
    }

    res.status(200).json({
      message: `User updated successfully`,
      user: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        about: updatedUser.about,
        campus: updatedUser.campus,
        profilePictureKey: updatedUser.profilePictureKey,
        myListings: updatedUser.myListings,
        myFavorites: updatedUser.myFavorites,
      },
    });
  } catch (error) {
    res.status(500).json({ message: `An error occurred while updating the user`, error });
  }
});

// Route to edit the user's 'about' field
router.put('/editUserAbout/:userId', async (req, res) => {
  const { userId } = req.params;
  const { about } = req.body;

  try {
    // Find the user by ID and update the 'about' field
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { about },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: `User not found` });
    }

    res.status(200).json({
      message: `User 'about' field updated successfully`,
      user: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        about: updatedUser.about,
        campus: updatedUser.campus,
        profilePictureKey: updatedUser.profilePictureKey,
        myListings: updatedUser.myListings,
        myFavorites: updatedUser.myFavorites,
      },
    });
  } catch (error) {
    res.status(500).json({ message: `An error occurred while updating the 'about' field`, error });
  }
});

//Add the listingId to the user schema (for myFavorites).
router.post('/addListingToUser/myFavorites/:userId', async (req, res) => {
  const {userId} = req.params;
  const {listingId} = req.body;
  try{
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { myFavorites: listingId } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Listing added to user (myFavorites)', user });

  }catch(error){
    console.error('Error updating user myFavorites:', error);
    res.status(500).json({ message: 'Failed to update user', error });
  }
})

// Route to remove a listing ID from a user's favorites
router.post('/removeListingFromUser/myFavorites/:userId', async (req, res) => {
  const { userId } = req.params;
  const { listingId } = req.body;

  try {
    // Find the user and update their favorites by pulling the listingId
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { myFavorites: listingId } },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Listing removed from favorites', user });
  } catch (error) {
    console.error('Error removing listing from favorites:', error);
    res.status(500).json({ message: 'An error occurred while updating favorites', error });
  }
});

// Get all users
router.get('/getAllUsers', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
