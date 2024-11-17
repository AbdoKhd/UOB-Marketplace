
import { useState } from 'react';
import React from 'react'
import './LoginForm.css';
import NavBar from '../../Components/NavBar/NavBar'
import http from '../../http-common';
import { FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Components/AuthContext';

import ScrollToTop from '../../Components/ScrollToTop/ScrollToTop';

const LoginForm = () => {

  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to the backend's register route
      const response = await http.post('/api/users/login', {
        email,
        password
      });

      if(response.status === 200){
        const loggedInUserId = response.data.loggedInUserId; // Extract userId from the response
        console.log("logged in userId: ", response.data.loggedInUserId);
        login(loggedInUserId);
        navigate('/');
      }

    } catch (error) {
      // Handle any errors
      console.error('There was an error loging in!', error);
      setErrorMessage('Incorrect Email or Password');
    }

  }



  return (
    <div className='login-register-page'>
      <ScrollToTop/>
      <NavBar/>
        <form className='login-register-container' onSubmit={handleSubmit}>
          <h1>Login</h1>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <div className='input-box'>
            <input type="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)}/>
            <FaEnvelope className='icon' />
          </div>
          <div className='input-box'>
            <input type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)}/>
            <FaLock className='icon' />
          </div>

          <div className='remember-forget' >
            <label>
              <input type="checkbox"/>
              Remember me
            </label>
            <a href='#'>Forgot password</a>
          </div>

          <button type='submit'>Login</button>

          <div className='register-link'>
            <p>Don't have an account? <a href='/register'>Sign up</a></p>
          </div>
        </form>
    </div>
  )
}

export default LoginForm
