import http from '../http-common';

export const fetchAllListings = async () => {
  try {
    const response = await http.get('/api/listings/getAllListings');
    return response.data;
  } catch (error) {
    console.error('Error fetching all listings:', error);
    throw error;
  }
};

export const fetchListing = async (listingId) => {
  try {
    const response = await http.get(`/api/listings/getListing/${listingId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all listings:', error);
    throw error;
  }
};

export const fetchListingsByIds = async (listingsId) => {
  try {
    const response = await http.post('/api/listings/getListingsByIds', {
      listingsId: listingsId,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching these listings:', error);
    throw error;
  }
};

export const postListing = async (imagesKey, title, category, description, price, userId) => {
  try {
    const response = await http.post('/api/listings/postListing', {
      imagesKey: imagesKey,
      title: title,
      category: category,
      description: description,
      price: price,
      user: userId
    });
    return response;
  } catch (error) {
    console.error('Error fetching all listings:', error);
    throw error;
  }
};

export const deleteListing = async (listingId) => {
  try {
    const response = await http.post(`/api/listings/deleteListing/${listingId}`);
    return response;
  } catch (error) {
    console.error('Error fetching all listings:', error);
    throw error;
  }
};