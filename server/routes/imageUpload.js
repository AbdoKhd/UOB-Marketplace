const express = require('express');
const router = express.Router();
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3Client = require('../aws-config');
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Configure multer to use S3 for storage
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: 'uob-marketplace',
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

    const imageKeys = req.files.map(file => file.key); // Use S3 `location` for URLs
    res.status(200).json({ message: 'Images uploaded successfully', imageKeys});
  } catch (error) {
    console.error('Error during image upload:', error);
    res.status(500).json({ message: 'Failed to upload images', error: error.message });
  }
});


// Route to get multiple images from S3 bucket
router.post('/getImages', async (req, res) => {
  try {
    let imagesKey = req.body.imagesKey; // array of keys

    // Ensure imagesKey is always an array
    if (!Array.isArray(imagesKey)) {
      imagesKey = [imagesKey]; // Convert single key to an array
    }

    if (!imagesKey || imagesKey.length === 0) {
      return res.status(400).json({ message: 'No image keys provided' });
    }

    // For every key fetch its image URL
    const getImagePromises = imagesKey.map(async (key) => {
      const command = new GetObjectCommand({
        Bucket: 'uob-marketplace',
        Key: key
      });

      // Generate a presigned URL for each image with a 1 hour expiry
      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

      return {
        key: key,
        content: url // Return the presigned URL
      };
    });

    const imageResults = await Promise.all(getImagePromises);

    res.status(200).json({ images: imageResults });
  } catch (error) {
    console.error('Error retrieving images:', error);
    res.status(500).json({ message: 'Failed to retrieve images', error: error.message });
  }
});

module.exports = router;
