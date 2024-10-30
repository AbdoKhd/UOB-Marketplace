
import './App.css';
import { AuthProvider } from './Components/AuthContext' ;
import LoginForm from './Pages/LoginForm/LoginForm';
import RegistrationForm from './Pages/RegistrationForm/RegistrationForm';
import {Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage/HomePage';
import ListingsPage from './Pages/ListingsPage/ListingsPage';
import SellPage from './Pages/SellPage/SellPage';
import ProfilePage from './Pages/ProfilePage/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <Routes >
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/sell" element={<SellPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </AuthProvider>
  )
}

export default App;
