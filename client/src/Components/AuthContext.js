import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Check localStorage for auth status on load
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    const storedUser = localStorage.getItem('user');

    if (authStatus) {
      setIsAuthenticated(JSON.parse(authStatus));
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

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
