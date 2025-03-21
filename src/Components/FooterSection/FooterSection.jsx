import { useState, useEffect } from "react";
import './FooterSection.css'
import logo from '../../Assets/UOB-logo.png'
import {Link} from 'react-scroll'
import Feedback from '../Feedback/Feedback'
import { useAuth } from '../../Components/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

// React Toastify
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FooterSection = () => {
  const { loggedInUserId } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  //For notifications/alerts
  useEffect(() => {

    if(location.state?.alert){
      toast.info(location.state.alert);
      // Clear the state after showing the notification
      navigate(location.pathname, { replace: true, state: {} });
    }

  }, [location.state]);

  // Disable scrolling when a popup is visible.
  useEffect(() => {
    if (isFeedbackOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isFeedbackOpen]);

  return (
    <div className='footer'>
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
      
      <div className='footer-left'>
        <img src={logo} alt="" className='logo'/>
        <p>Buy, sell, and rent.</p>
      </div>
      <div className='footer-right'>
        <div className='col'>
          <h2>Sections</h2>
          <p><Link to='hero' smooth={true} offset={0} duration={500}>Home</Link></p>
          <p><Link to='cta' smooth={true} offset={-300} duration={500}>Get Started</Link></p>
          <p><Link to='about' smooth={true} offset={-180} duration={500}>About Us</Link></p>
          <p><Link to='features' smooth={true} offset={-350} duration={500}>Features</Link></p>
          <p><Link to='ratings' smooth={true} offset={-150} duration={500}>Ratings</Link></p>
        </div>
        <div className='col'>
          <h2>Social Media</h2>
          <p>Instagram</p>
          <p>LinkedIn</p>
        </div>
        <div className='col'>
          <h2>Contact Us</h2>
          <p>uob.marketplace@gmail.com</p>
          <p
            className="feedback-link" 
            onClick={() => {
                            if(!loggedInUserId) navigate(location.pathname, {replace: true, state: { alert: "You must login!" } })
                            else setIsFeedbackOpen(true)
                          }
                    }
          >
            Give feedback
          </p>
        </div>
      </div>
      
      <Feedback
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
      
    </div>
  )
}

export default FooterSection