import http from '../http-common';

export const getImages = async (imagesKey) => {
  try {
    const response = await http.post('/api/images/getImages', {
      imagesKey: imagesKey,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching the images:', error);
    throw error;
  }
};

export const uploadImages = async (formData) => {
  try {
    // Send POST request with FormData
    const response = await http.post('/api/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading the images:', error);
    throw error;
  }
};