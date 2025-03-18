import axios from "axios";

// http://192.168.1.179:5001

const http = axios.create({
  baseURL: "https://uob-marketplace-api-0f05a58ba21a.herokuapp.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token dynamically before every request
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// Function to handle logout (to be set later)
let logoutFunction = null;

// Allow setting logout function dynamically
export const setLogoutFunction = (logoutFn) => {
  logoutFunction = logoutFn;
};

// Handle token expiration in responses
http.interceptors.response.use(
    (response) => response, // Return response normally if successful
    (error) => {
        if (error.response?.status === 401) {
        console.log("Token expired. Logging out...");
        if (logoutFunction) {
            logoutFunction(); // Call the logout function from context
        }
        }
        return Promise.reject(error);
    }
);

export default http;