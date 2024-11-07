
import { useState} from 'react';
import axios from 'axios';
import React from 'react'
import '../LoginForm/LoginForm.css'
import './RegistrationForm.css';
import NavBar from '../../Components/NavBar/NavBar'
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Components/AuthContext';

const RegistrationForm = () => {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    // Reset error message if passwords match
    setErrorMessage("");

    try {
      // Make a POST request to the backend's register route
      const response = await axios.post('http://localhost:5000/api/users/register', {
        firstName,
        lastName,
        email,
        password
      });

      if(response.status === 200){
        const userData = response.data.user; // Extract user details from the response
        login(userData);
        navigate('/');
      }


    } catch (error) {
      // Handle any errors
      console.error('There was an error registering the user!', error);
      setErrorMessage("Registration failed. Please try again.");
    }
  }

  return (
    <div className='login-register-page'>
      <NavBar/>
      <form className='login-register-container' onSubmit={handleSubmit}>
        <h1>Register</h1>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className='input-box'>
          <input type="text" placeholder="First Name" required onChange={(e) => setFirstName(e.target.value)}/>
          <FaUser className='icon' />
        </div>
        <div className='input-box'>
          <input type="text" placeholder="Last Name" required onChange={(e) => setLastName(e.target.value)}/>
          <FaUser className='icon' />
        </div>
        <div className='input-box'>
          <input type="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)}/>
          <FaEnvelope className='icon' />
        </div>
        <div className='input-box'>
          <input type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)}/>
          <FaLock className='icon'/>
        </div>
        <div className='input-box'>
          <input type="password" placeholder="Confirm Password" required onChange={(e) => setConfirmPassword(e.target.value)}/>
          <FaLock className='icon'/>
        </div>

        <button type='submit'>Register</button>

        <div className='register-link'>
          <p>Already have an account? <a href='/login'>Login</a></p>
        </div>
      </form>
    </div>
  )
}

export default RegistrationForm

