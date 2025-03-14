import React from 'react'
import './ForgotPasswordForm.css'
import { useState } from 'react';
import NavBar from '../../Components/NavBar/NavBar'
import { FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { fetchUserByEmail } from '../../Services/userService';
import { sendResetCode, verifyResetCode } from '../../Services/codeToEmailService';
import { changePassword } from '../../Services/userService';

import ScrollToTop from '../../Components/ScrollToTop/ScrollToTop';

const ForgotPasswordForm = () => {

  const[email, setEmail] = useState("");
  const[codeSent, setCodeSent] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [codeVerified, setCodeVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!codeSent){

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
          console.log("email should now be empty");
        } else {
          setErrorMessage("Failed to send reset code");
        }
        
      } catch (error) {
        setErrorMessage('An error occurred');
      }
    }
    else if(!codeVerified){
      try{
        const verifyCodeResponse = await verifyResetCode(email, resetCode);

        if(verifyCodeResponse.status === 200){
          setCodeVerified(true);
          setErrorMessage("");
        }
        else {
          setErrorMessage(verifyCodeResponse.data.message);
        }
      }catch(error){
        setErrorMessage(error);
      }
    }
    else{
      handlePasswordReset();
    }
  }

  const handlePasswordReset = async () => {
    if (password === "" || confirmPassword === "") {
      setErrorMessage("Please fill in both password fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setErrorMessage("");
      const changePasswordResponse = await changePassword(email, password);

      if (changePasswordResponse.status === 200) {
        alert("Password reset successful! Redirecting to login...");
        navigate("/login");
      } else {
        setErrorMessage(changePasswordResponse.data.message);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className='login-register-page'>
      <ScrollToTop/>
      <NavBar/>
        <form className='login-register-container' onSubmit={handleSubmit}>
          <h1>Forgot your password?</h1>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          
          <div className="input-box">
            <input
              className={codeSent ? "disabled" : ""}
              disabled={codeSent}
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => {
                setErrorMessage("");
                setEmail(e.target.value);
              }}
            />
            <FaEnvelope className="icon" />
          </div>

          {codeSent && !codeVerified &&(
            // Show reset code input after sending the code
            <div className="input-box">
              <input
                type="text"
                placeholder="Enter reset code"
                required
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
              />
            </div>
          )}

          {codeVerified && (
          <>
            <div className="input-box">
              <input
                type="password"
                placeholder="Enter new password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="input-box">
              <input
                type="password"
                placeholder="Confirm new password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </>
        )}

          <button type="submit">
            {codeVerified ? "Change Password" : codeSent ? "Verify Code" : "Send Reset Code"}
          </button>
        </form>
    </div>
  )
}

export default ForgotPasswordForm