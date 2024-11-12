const express = require('express');
const router = express.Router();
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3Client = require('../aws-config');

// Configure multer to use S3 for storage
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: 'uob-marketplace-images',
    // acl: 'public-read', // Allows public access to the files
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname); // Unique filename
    }
  })
});

// Route for handling file upload
router.post('/upload', upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const imageUrls = req.files.map(file => file.location); // Use S3 `location` for URLs
    res.status(200).json({ message: 'Images uploaded successfully', imageUrls });
  } catch (error) {
    console.error('Error during image upload:', error);
    res.status(500).json({ message: 'Failed to upload images', error: error.message });
  }
});

module.exports = router;
