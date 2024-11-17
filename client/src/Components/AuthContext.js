import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [loggedInUserId, setLoggedInUserId] = useState(() => {
    try {
      const storedUser = localStorage.getItem('loggedInUserId');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const storedStatus = localStorage.getItem('isAuthenticated');
      return storedStatus ? JSON.parse(storedStatus) : false;
    } catch (error) {
      console.error('Error parsing authentication status from localStorage:', error);
      return false;
    }
  });
  
// I deleted the user in mongodb atlas but local storage still has the user saved.
  // useEffect(() => {
  //   if (user && isAuthenticated) {
  //     // Request to verify if the user still exists in the database
  //     fetch(`/api/users/${user.id}`)
  //       .then(response => {
  //         if (!response.ok) {
  //           throw new Error('User not found');
  //         }
  //         return response.json();
  //       })
  //       .catch(() => {
  //         // If user doesn't exist, clear localStorage and update context
  //         logout();
  //       });
  //   }
  // }, [user, isAuthenticated]);

  // Login function
  const login = (userId) => {
    setIsAuthenticated(true);
    setLoggedInUserId(userId);
    localStorage.setItem('isAuthenticated', true); // Store in localStorage
    localStorage.setItem('loggedInUserId', JSON.stringify(userId));
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    setLoggedInUserId(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('loggedInUserId');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loggedInUserId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
