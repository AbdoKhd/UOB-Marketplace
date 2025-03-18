
import { useState, useEffect} from 'react';
import React from 'react'
import '../LoginForm/LoginForm.css'
import './RegistrationForm.css';
import NavBar from '../../Components/NavBar/NavBar'
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Components/AuthContext';
import { signUp } from '../../Services/userService';
import { sendRegistrationCode, verifyRegistrationCode } from '../../Services/codeToEmailService';

import ScrollToTop from '../../Components/ScrollToTop/ScrollToTop';

// React Toastify
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegistrationForm = () => {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false); // For loading
  const [codeVerified, setCodeVerified] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false); // For loading
  const [registrationCode, setRegistrationCode] = useState();
  const [registering, setRegistering] = useState(false); // For loading
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  //For notifications/alerts
  useEffect(() => {

    if(location.state?.notification){
      toast.success(location.state.notification);
      // Clear the state after showing the notification
      navigate(location.pathname, { replace: true, state: {} });
    }

  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");

    if(!codeSent && !codeVerified){
      try{
        setSendingCode(true); // Start loading

        const registrationCodeResponse = await sendRegistrationCode(email);

        if(registrationCodeResponse.status === 200){
          setCodeSent(true);
          navigate(location.pathname, {replace: true, state: { notification: "Code sent to your email (check spam or junk)" } });
        }
        else{
          setErrorMessage(registrationCodeResponse.data.message);
        }
      }
      catch(error){
        setErrorMessage(error);
      }
      finally {
        setSendingCode(false); // Stop loading
      }
    }
    else if(!codeVerified){
      try{
        setVerifyingCode(true); // Start loading

        const verificationResponse = await verifyRegistrationCode(email, registrationCode);

        if(verificationResponse.status === 200){
          setCodeVerified(true);
          navigate(location.pathname, {replace: true, state: { notification: "Code is correct!" } });
        }
        else{
          setErrorMessage(verificationResponse.data.message);
        }
      }
      catch(error){
        setErrorMessage(error);
      }
      finally {
        setVerifyingCode(false); // Stop loading
      }
    }
    else{
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }

      try {
        setRegistering(true); // Start loading

        const response = await signUp(firstName, lastName, email, password);

        if(response.status === 200){
          const loggedInUserId = response.data.loggedInUserId;
          login(loggedInUserId);
          navigate('/listings/category/All/order/Newest First/campus/All/pgn/1');
        }
        else{
          setErrorMessage(response.data.message);
        }
      } catch (error) {
        setErrorMessage("Registration failed. Please try again.");
      }
      finally {
        setRegistering(false); // Stop loading
      }
    }
  }

  return (
    <div className='login-register-page'>
      <ScrollToTop/>
      <NavBar/>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="light"
      />
      <form className='login-register-container' onSubmit={handleSubmit}>
        <h1>Register</h1>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        
        <div className='input-box'>
          <input 
            className={codeSent ? "disabled" : ""}
            disabled={codeSent} type="email" 
            placeholder="Enter your UOB Email" 
            required 
            onChange={(e) => setEmail(e.target.value)}
          />
          <FaEnvelope className='icon' />
        </div>

        {codeSent && !codeVerified &&(
          // Show registration code input after sending the code
          <div className="input-box">
            <input
              type="text"
              placeholder="Enter registration code"
              required
              onChange={(e) => setRegistrationCode(e.target.value)}
            />
          </div>
        )}

        {codeVerified && (
          <>
            <div className='input-box'>
              <input type="text" placeholder="First Name" required onChange={(e) => setFirstName(e.target.value)}/>
              <FaUser className='icon' />
            </div>
            <div className='input-box'>
              <input type="text" placeholder="Last Name" required onChange={(e) => setLastName(e.target.value)}/>
              <FaUser className='icon' />
            </div>
            <div className='input-box'>
              <input type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)}/>
              <FaLock className='icon'/>
            </div>
            <div className='input-box'>
              <input type="password" placeholder="Confirm Password" required onChange={(e) => setConfirmPassword(e.target.value)}/>
              <FaLock className='icon'/>
            </div>
          </>
        )}

        {(sendingCode || verifyingCode || registering) ? (
          <div className="loader"></div>
        ) : (
          <button type='submit'>
            {codeVerified ? "Register" : codeSent ? "Verify Code" : "Verify"}
          </button>
        )}
        

        <div className='register-link'>
          <p>Already have an account? <a href='/login'>Login</a></p>
        </div>
      </form>
    </div>
  )
}

export default RegistrationForm

