import {useEffect, useState} from 'react'
import './UserPage.css'
import profilePic from '../../Assets/default-profile-pic.png'
import { useAuth } from '../../Components/AuthContext';
import http from '../../http-common';
import { useNavigate, useParams } from 'react-router-dom';

import NavBar from '../../Components/NavBar/NavBar';

import ScrollToTop from '../../Components/ScrollToTop/ScrollToTop';

const UserPage = () => {

  const {userId}  = useParams(); // The user we're viewing
  const { loggedInUserId } = useAuth(); // The logged in user
  // If these two are the same then redirect to profile page.

  const navigate = useNavigate();
  const [fetchedUser, setFetchedUser] = useState();
  const [loading, setLoading] = useState(true);

  const handleSeeUserListings = () =>{
    navigate('/otherListings', {
      state: {
        pageTitle: `${fetchedUser.firstName}'s listings`,
        userId: userId,
      },
    })
  }

  useEffect( () =>{

    if(loggedInUserId === userId){
      navigate('/profile');
    }
    else{
      // Fetch user
      const fetchUser = async () => {
        try {
          const userResponse = await http.get(`/api/users/getUser/${userId}`);

          setFetchedUser(userResponse.data.user);
          setLoading(false);

        } catch (error) {
          console.error('Error fetching the user:', error);
        }
      };

      fetchUser();
    }
  }, [userId, loggedInUserId, navigate])

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
  
  if (!fetchedUser) {
    return (
      <div>
        <NavBar/>
        <div className='spinner-wrapper'>
          <p>User not found</p>;
        </div>
      </div>
    )
  }

  return (
    <div className='user-page'>
      <ScrollToTop/>
      <NavBar/>
      <h2>{fetchedUser.firstName}'s profile</h2>
      <div className='profile-container'>
        <div className='profile-pic'>
          <img src={profilePic} alt='Profile' />
        </div>
        <div className='profile-info'>
          <h2>{fetchedUser.firstName} {fetchedUser.lastName}</h2>
          <p>{fetchedUser.email}</p>
          <p>Campus: AL Kurah </p>
        </div>
      </div>
      <div className='about-container'>
        <div className='about-info'>
          <h3>About</h3>
          <p>Currently pursuing a Bachelor of Science in Computer Science. I'm passionate about transforming innovative ideas into efficient, user-friendly software.</p>
        </div>
      </div>
      <div className='my-listings-container'>
        <h3>{fetchedUser.firstName}'s listings</h3>
        <button className='edit-btn' onClick={handleSeeUserListings}> See </button>
      </div>
    </div>
  )
}

export default UserPage