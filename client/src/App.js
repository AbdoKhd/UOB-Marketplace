
import './App.css';
import { AuthProvider } from './Components/AuthContext' ;
import LoginForm from './Pages/LoginForm/LoginForm';
import RegistrationForm from './Pages/RegistrationForm/RegistrationForm';
import {Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage/HomePage';
import ListingsPage from './Pages/ListingsPage/ListingsPage';
import SellPage from './Pages/SellPage/SellPage';
import ProfilePage from './Pages/ProfilePage/ProfilePage';
import ProtectedRouteLoggedOut from './Components/ProtectedRouteLoggedOut';
import ProtectedRouteLoggedIn from './Components/ProtectedRouteLoggedIn';

function App() {

  return (
    <AuthProvider>
      <Routes >
        <Route path="/login" element={ <ProtectedRouteLoggedIn> <LoginForm /> </ProtectedRouteLoggedIn>} />
        <Route path="/register" element={ <ProtectedRouteLoggedIn> <RegistrationForm /> </ProtectedRouteLoggedIn>} />
        <Route path="/" element={<HomePage />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/sell" element={ <ProtectedRouteLoggedOut> <SellPage/> </ProtectedRouteLoggedOut>} />
        <Route path="/profile" element={ <ProtectedRouteLoggedOut> <ProfilePage/> </ProtectedRouteLoggedOut>} />
      </Routes>
    </AuthProvider>
  )
}

export default App;
