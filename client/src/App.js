
import './App.css';
import NavBar from './Components/NavBar/NavBar';
import LoginForm from './Pages/LoginForm/LoginForm';
import RegistrationForm from './Pages/RegistrationForm/RegistrationForm';
import {Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage/HomePage';
import ListingsPage from './Pages/ListingsPage/ListingsPage';

function App() {
  return (
    <>
      <Routes >
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/listings" element={<ListingsPage />} />
      </Routes>


      
    </>
  )
}

export default App;
