import React from 'react'
import './ForgotPasswordForm.css'
import { useState, useEffect } from 'react';
import NavBar from '../../Components/NavBar/NavBar'
import { FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchUserByEmail } from '../../Services/userService';
import { sendResetCode, verifyResetCode } from '../../Services/codeToEmailService';
import { changePassword } from '../../Services/userService';

import ScrollToTop from '../../Components/ScrollToTop/ScrollToTop';

// React Toastify
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPasswordForm = () => {

  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false); // For loading
  const [resetCode, setResetCode] = useState("");
  const [codeVerified, setCodeVerified] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false); // For loading
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetting, setresetting] = useState(false); // For loading
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

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

    if(!codeSent){

      if(email === ""){
        setErrorMessage("Email required");
        return;
      }

      // Check if the email is in the database
      try {
        setSendingCode(true);

        const response = await fetchUserByEmail(email);

        if(response.status === 404){
          setErrorMessage('There is no user with this email');
          return;
        }
        setErrorMessage("");

        // Send reset code request
        const sendCodeResponse = await sendResetCode(email);

        if (sendCodeResponse.status === 200) {
          setCodeSent(true);
          navigate(location.pathname, {replace: true, state: { notification: "Code sent to your email (check spam or junk)" } });
        } else {
          setErrorMessage("Failed to send reset code");
        }
        
      } catch (error) {
        setErrorMessage('An error occurred');
      }
      finally {
        setSendingCode(false); // Stop loading
      }
    }
    else if(!codeVerified){
      try{
        setVerifyingCode(true);

        const verifyCodeResponse = await verifyResetCode(email, resetCode);

        if(verifyCodeResponse.status === 200){
          setCodeVerified(true);
          navigate(location.pathname, {replace: true, state: { notification: "Code is correct!" } });
        }
        else {
          setErrorMessage(verifyCodeResponse.data.message);
        }
      }catch(error){
        setErrorMessage(error);
      }
      finally {
        setVerifyingCode(false); // Stop loading
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
      setresetting(true);

      const changePasswordResponse = await changePassword(email, password);

      if (changePasswordResponse.status === 200) {
        alert("Password reset successful! Redirecting to login");
        navigate("/login");
      } else {
        setErrorMessage(changePasswordResponse.data.message);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
    finally {
      setresetting(false); // Stop loading
    }
  };

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

        {(sendingCode || verifyingCode || resetting) ? (
          <div className="loader"></div>
        ) : (
          <button type="submit">
            {codeVerified ? "Change Password" : codeSent ? "Verify Code" : "Send Reset Code"}
          </button>
        )}
      </form>
    </div>
  )
}

export default ForgotPasswordForm