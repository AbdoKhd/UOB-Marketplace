import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Components/AuthContext';

const ProfilePage = () => {

  const navigate = useNavigate();

  const {logout } = useAuth();

  function handleLogoutButton(){
    navigate('/');
    logout();
  }


  return (
    <div className='profile'>
      <button onClick={handleLogoutButton} className='logout-btn'>LOGOUT</button>
    </div>
  )
}

export default ProfilePage