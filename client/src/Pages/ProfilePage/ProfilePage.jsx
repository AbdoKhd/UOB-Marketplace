import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Components/AuthContext';
import './ProfilePage.css'
import NavBar from '../../Components/NavBar/NavBar';
import profilePic from '../../Assets/default-profile-pic.png'
import http from '../../http-common';

import ListingsGrid from '../../Components/ListingsGrid/ListingsGrid';

import ScrollToTop from '../../Components/ScrollToTop/ScrollToTop';

const ProfilePage = () => {

  const navigate = useNavigate();

  const {logout, loggedInUserId} = useAuth();

  const [loggedInUser, setLoggedInUser] = useState();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const handleSeeMyListings = () =>{
    navigate('/otherListings', {
      state: {
        pageTitle: 'My Listings',
        userId: loggedInUserId,
      },
    })
  }

  const handleSeeMyFavorites = () =>{
    navigate('/otherListings', {
      state: {
        pageTitle: 'My Favorites',
        userId: loggedInUserId,
      },
    })
  }

  useEffect(() =>{
    const fetchUser = async () => {
      try{
        const userResponse = await http.get(`/api/users/getUser/${loggedInUserId}`);
        console.log("got the user: ", userResponse.data.user)
        setLoggedInUser(userResponse.data.user);
        setLoading(false);

      }catch(error){
        console.error('Error fetching logged in user:', error);
        setLoading(false);
      }
    }

    fetchUser();
  }, [loggedInUserId]);

  // Handle loading and null checks
  if (loading) {
    return (
      <div>
        <NavBar/>
        <div className='spinner-wrapper'>
          <div className='spinner'></div>
        </div>
      </div>
    )  
  }

  if (!loggedInUser) {
    return (
      <div>
        <NavBar/>
        <div className='spinner-wrapper'>
          <p>User not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className='profile-page'>
      <ScrollToTop/>
      <NavBar/>
      <div className='profile-container'>
        <div className='profile-pic'>
          <img src={profilePic} alt='Profile' />
        </div>
        <div className='profile-info'>
          <h2>{loggedInUser.firstName} {loggedInUser.lastName}</h2>
          <p>{loggedInUser.email}</p>
          <p>Campus: AL Kurah </p>
        </div>
        <button className='edit-btn'> Edit</button>
      </div>
      <div className='about-container'>
        <div className='about-info'>
          <h3>About</h3>
          <p>Currently pursuing a Bachelor of Science in Computer Science. I'm passionate about transforming innovative ideas into efficient, user-friendly software.</p>
        </div>
        <button className='edit-btn'> Edit</button>
      </div>
      <div className='my-listings-container'>
        <h3>My listings</h3>
        <button className='edit-btn' onClick={handleSeeMyListings}> See </button>
      </div>
      <div className='my-listings-container'>
        <h3>My favorites</h3>
        <button className='edit-btn' onClick={handleSeeMyFavorites}> See </button>
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