import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';


//This component is to protect routes from logged out users. (Ex: /sell should not be accessed by logged out user)
const ProtectedRouteLoggedOut = ({children}) => {

  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // could return a loading spinner here
  }

  return isAuthenticated ? children : <Navigate to="/login" />;

};

export default ProtectedRouteLoggedOut;