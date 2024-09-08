
import { useState, useEffect } from 'react';
import axios from 'axios';
import React from 'react'
import '../LoginForm/LoginForm.css'
import './RegistrationForm.css';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import NavBar from '../../Components/NavBar/NavBar';

const RegistrationForm = () => {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to the backend's register route
      const response = await axios.post('http://localhost:5000/api/users/register', {
        username,
        email,
        password
      });

      if(response.status === 200){
        navigate('/home')
      }


    } catch (error) {
      // Handle any errors
      console.error('There was an error registering the user!', error);
    }
  }

  return (
    <div className='login-register-page'>
      <div className='login-register-form'>
        <div className='wrapper'>
          <form onSubmit={handleSubmit}>
            <h1>Register</h1>
            <div className='input-box'>
              <input type="text" placeholder="Username" required onChange={(e) => setUsername(e.target.value)}/>
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

            <button type='submit'>Register</button>

            <div className='register-link'>
              <p>Already have an account? <a href='/login'>Login</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegistrationForm

