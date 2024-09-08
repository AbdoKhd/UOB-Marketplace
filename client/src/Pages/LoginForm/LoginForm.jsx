
import { useState } from 'react';
import React from 'react'
import './LoginForm.css';
import axios from 'axios';
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import NavBar from '../../Components/NavBar/NavBar';

const LoginForm = () => {

  const[username, setUsername] = useState("");
  const[password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // Make a POST request to the backend's register route
      const response = await axios.post('http://localhost:5000/api/users/login', {
        username,
        password
      });

      if(response.status === 200){
        navigate('/home')
      }

    } catch (error) {
      // Handle any errors
      console.error('There was an error loging in!', error);
    }

  }



  return (
    <div className='login-register-page'>
      <div className='login-register-form'>
        <div className='wrapper'>
          <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <div className='input-box'>
              <input type="text" placeholder="Username" required onChange={(e) => setUsername(e.target.value)}/>
              <FaUser className='icon' />
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
      </div>
    </div>
  )
}

export default LoginForm
