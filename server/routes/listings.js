const express = require('express');
const Listing = require('../models/Listing');
const router = express.Router();

// Post a new listing
router.post('/postListing', async (req, res) => {
  const { title, category, price, user } = req.body;

  // Validate required fields
  if (!title || !category || !price || !user) {
    return res.status(400).json({ message: 'All required fields must be filled out.'});
  }

  try {
    const newListing = new Listing(req.body);
    await newListing.save();
    res.status(200).json({message: 'Listing Posted Successful', newListing});
  } catch (error) {
    res.status(400).json({ message: 'Failed to post listing. ' + error.message});
  }
});

// Get all listings
router.get('/getListings', async (req, res) => {
  try {
    const listings = await Listing.find().populate('user');
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve listings. ' + error.message});
  }
});

module.exports = router;
