const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//User Routes
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);


//Listing Routes
console.log("reached backend")
const listingRoutes = require('./routes/listings');
app.use('/api/listings', listingRoutes);


// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch((error) => console.error('MongoDB connection error:', error));
