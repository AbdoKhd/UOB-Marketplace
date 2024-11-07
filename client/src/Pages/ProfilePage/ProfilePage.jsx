import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Components/AuthContext';
import './ProfilePage.css'
import NavBar from '../../Components/NavBar/NavBar';

const ProfilePage = () => {

  const navigate = useNavigate();

  const {logout } = useAuth();

  function handleLogoutButton(){
    navigate('/');
    logout();
  }


  return (
    <div className='profile-page'>
      <NavBar/>
      <div className='profile-container'>

      </div>
      <button onClick={handleLogoutButton} className='logout-btn'>LOGOUT</button>
    </div>
  )
}

export default ProfilePage