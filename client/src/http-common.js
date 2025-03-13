import axios from "axios";

const http = axios.create({
  baseURL: "http://192.168.1.144:5000",
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