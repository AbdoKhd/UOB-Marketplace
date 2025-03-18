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

export const fetchListings = async ({ page = 1, limit = 5, searchQuery = '', category = 'All', sorting = 'Newest First', campus = 'All' }) => {
  try {
    // Construct query parameters
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      searchQuery,
      category,
      sorting,
      campus
    });

    const response = await http.get(`/api/listings/getListings?${params.toString()}`);
    return response.data; // Return the data containing listings, currentPage, and totalPages
  } catch (error) {
    console.error('Error fetching listings:', error);
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
    console.log("price in service: ", price);
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
    console.error('Error posting the listing:', error);
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