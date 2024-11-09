import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
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
  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('isAuthenticated', true); // Store in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
