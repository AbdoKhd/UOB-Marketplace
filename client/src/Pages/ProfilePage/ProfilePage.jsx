import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Components/AuthContext';
import './ProfilePage.css'
import NavBar from '../../Components/NavBar/NavBar';
import profilePic from '../../Assets/default-profile-pic.png'

const ProfilePage = () => {

  const navigate = useNavigate();

  const {logout, user} = useAuth();

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const handleLogoutButton = () => {
    setShowLogoutPopup(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/');
  };

  const cancelLogout = () => {
    setShowLogoutPopup(false);
  };

  return (
    <div className='profile-page'>
      <NavBar/>
      <div className='profile-container'>
        <div className='profile-pic'>
          <img src={profilePic} alt='Profile' />
        </div>
        <div className='profile-info'>
          <h2>{user.firstName} {user.lastName}</h2>
          <p>{user.email}</p>
          <p>Campus: AL Kurah </p>
        </div>
        <button className='edit-btn'> Edit</button>
      </div>
      <div className='about-container'>
        <div className='about-info'>
          <h2>About</h2>
          <p>Currently pursuing a Bachelor of Science in Computer Science. I'm passionate about transforming innovative ideas into efficient, user-friendly software.</p>
        </div>
        <button className='edit-btn'> Edit</button>
      </div>
      <button onClick={handleLogoutButton} className='logout-btn'>LOGOUT</button>

      {showLogoutPopup && (
      <>
        <div className='overlay'></div>
        <div className='logout-popup'>
          <p>Are you sure you want to log out?</p>
          <div className='buttons'>
            <button onClick={confirmLogout}>Yes</button>
            <button onClick={cancelLogout}>No</button>
          </div>
        </div>
      </>
    )}
    </div>
  )
}

export default ProfilePage