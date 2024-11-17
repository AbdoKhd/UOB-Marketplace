const express = require('express');
const Listing = require('../models/Listing');
const router = express.Router();

// Post a new listing
router.post('/postListing', async (req, res) => {
  const {title, category, price, user} = req.body;

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

// Delete a listing
router.post('/deleteListing/:listingId', async (req, res) => {
  const {listingId} = req.params;

  try {
    
    const deletedListing = await Listing.findByIdAndDelete(listingId);

    if (!deletedListing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.status(200).json({message: 'Listing deleted Successful', deletedListing});
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete listing. ' + error.message});
  }
});

// Get all listings
router.get('/getAllListings', async (req, res) => {
  try {
    const listings = await Listing.find().populate('user');
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve listings. ' + error.message});
  }
});

// Route to get listings by an array of IDs
router.post('/getListingsByIds', async (req, res) => {
  const { listingsId } = req.body; // Expect an array of IDs

  try {
    // Find listings that match the IDs in the array
    const listings = await Listing.find({ _id: { $in: listingsId } });
    res.status(200).json({message: 'Listings fetched Successfully', listings });
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'An error occurred while fetching listings' });
  }
});

// Get one listing
router.get('/getListing/:listingId', async (req, res) => {
  const {listingId} = req.params;
  try {
    const listing = await Listing.findById(listingId).populate('user');

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found.'});
    }

    res.status(200).json({ message: 'Listing retrieved successfully', listing });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve the listing. ' + error.message });
  }
});

module.exports = router;
