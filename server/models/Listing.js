const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  price: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',  // This refers to the User model
    required: true
  }
})

const Listing = mongoose.model('Listing', ListingSchema);

module.exports = Listing;