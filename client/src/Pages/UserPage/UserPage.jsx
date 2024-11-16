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
  const { user } = useAuth(); // The logged in user
  // If these two are the same then redirect to profile page.

  const navigate = useNavigate();
  const [fetchedUser, setFetchedUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect( () =>{

    if(user.id === userId){
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
  }, [userId, user.id, navigate])

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
          <h2>About</h2>
          <p>{fetchedUser.about}</p>
        </div>
      </div>
      <div className='user-listings-container'>
        <h2>{fetchedUser.firstName}'s listings</h2>
        <div className='user-listings'>
        </div>
      </div>
    </div>
  )
}

export default UserPage