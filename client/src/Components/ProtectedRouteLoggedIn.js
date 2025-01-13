import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';


//This component is to protect routes from logged in users. (/login or /register should not be accessed by logged in users)
const ProtectedRouteLoggedIn = ({children}) => {

  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/profile" /> :  children;
  
};

export default ProtectedRouteLoggedIn;