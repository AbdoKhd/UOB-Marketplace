import React from 'react'
import './ForgotPasswordForm.css'
import { useState } from 'react';
import NavBar from '../../Components/NavBar/NavBar'
import { FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { fetchUserByEmail } from '../../Services/userService';
import { sendResetCode } from '../../Services/codeToEmailService';

import ScrollToTop from '../../Components/ScrollToTop/ScrollToTop';

const ForgotPasswordForm = () => {

  const[email, setEmail] = useState("");
  const[codeSent, setCodeSent] = useState(false);
  const[password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(email === ""){
      setErrorMessage("Email required");
      return;
    }

    // Check if the email is in the database
    try {
      const response = await fetchUserByEmail(email);

      if(response.status === 404){
        setErrorMessage('There is no user with this email');
        return;
      }
      setErrorMessage("");

      // Send reset code request
      const sendCodeResponse = await sendResetCode(email);

      console.log("this is response status: ", sendCodeResponse.status);

      if (sendCodeResponse.status === 200) {
        setCodeSent(true);
        setEmail("");
      } else {
        setErrorMessage("Failed to send reset code");
      }
      
    } catch (error) {
      setErrorMessage('An error occurred');
    }

    // Send code

    // If code is co

  }

  return (
    <div className='login-register-page'>
      <ScrollToTop/>
      <NavBar/>
        <div className='login-register-container'>
          <h1>Forgot your password?</h1>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <div className='input-box'>
            <input type="email" placeholder="Enter your email" onChange={(e) =>{ setErrorMessage(""); setEmail(e.target.value)} }/>
            <FaEnvelope className='icon' />
          </div>

          <button onClick={handleSubmit}>Send reset code</button>
        </div>
    </div>
  )
}

export default ForgotPasswordForm