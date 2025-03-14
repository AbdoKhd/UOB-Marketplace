import http from '../http-common';

export const signIn = async (email, password) => {
  try {
    const response = await http.post('/api/users/login', {
      email,
      password
    });
    localStorage.setItem("token", response.data.token);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const signUp = async (firstName, lastName, email, password) => {
  try {
    const response = await http.post('/api/users/register', {
      firstName,
      lastName,
      email,
      password
    });
    localStorage.setItem("token", response.data.token);
    return response;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const changePassword = async (email, password) => {
  try {
    const response = await http.post('/api/users/changePassword', {
      email,
      password
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const fetchUser = async (userId) => {
  try {
    const response = await http.get(`/api/users/getUser/${userId}`);
    return response.data.user;
  } catch (error) {
    console.error('Error fetching the user:', error);
    throw error;
  }
};

export const fetchUserByEmail = async (email) => {
  try {
    const response = await http.get(`/api/users/getUserByEmail/${email}`);
    return response;
  } catch (error) {
    // console.error('Error fetching the user by email:', error);
    return error.response;
  }
};

export const editUser = async (userId, imageKey, newFirstName, newLastName, newCampus) => {
  try {
    // Make a PUT request to edit user
    const response = await http.put(`/api/users/editUser/${userId}`, {
      profilePictureKey: imageKey,
      firstName: newFirstName,
      lastName: newLastName,
      campus: newCampus
    });
    return response;
  } catch (error) {
    console.error("Error editing the user: ", error);
    throw error;
  }
};

export const editUserAbout = async (userId, newAbout) => {
  try {
    const response = await http.put(`/api/users/editUserAbout/${userId}`, {
      about: newAbout
    });
    return response;
  } catch (error) {
    console.error("Error editing the user's about: ", error);
    throw error;
  }
};

export const addToFavorites = async (userId, listingId) => {
  try {
    const addListingToUserFavorites = await http.post(`/api/users/addListingToUser/myFavorites/${userId}`, {
      listingId: listingId
    });
    return addListingToUserFavorites;
  } catch (error) {
    console.error("Error adding listing to favorites: ", error);
    throw error;
  }
};

export const removeFromFavorites = async (userId, listingId) => {
  try {
    const removeListingFromUserFavorites = await http.post(`/api/users/removeListingFromUser/myFavorites/${userId}`, {
      listingId: listingId
    });
    return removeListingFromUserFavorites;
  } catch (error) {
    console.error("Error removing listing from favorites: ", error);
    throw error;
  }
};

