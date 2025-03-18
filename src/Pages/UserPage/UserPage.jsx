import {useEffect, useState} from 'react'
import './UserPage.css'
import profilePic from '../../Assets/default-profile-pic.png'
import { useAuth } from '../../Components/AuthContext';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

import { fetchUser } from '../../Services/userService';
import { getImages } from '../../Services/imageService';
import { createConversation } from '../../Services/messagingService';

import NavBar from '../../Components/NavBar/NavBar';

import ScrollToTop from '../../Components/ScrollToTop/ScrollToTop';

import { FaArrowRightLong} from "react-icons/fa6";

// React Toastify
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserPage = () => {

  const {userId}  = useParams(); // The user we're viewing
  const { loggedInUserId } = useAuth(); // The logged in user
  // If these two are the same then redirect to profile page.

  const navigate = useNavigate();
  const location = useLocation();
  const [fetchedUser, setFetchedUser] = useState();
  const [loading, setLoading] = useState(true);

  const [profilePicture, setProfilePicture] = useState();

  const handleSeeUserListings = () =>{
    navigate(`/otherListings/${userId}/Listings`);
  }

  //For notifications/alerts
  useEffect(() => {

    if(location.state?.alert){
      toast.info(location.state.alert);
      // Clear the state after showing the notification
      navigate(location.pathname, { replace: true, state: {} });
    }

  }, [location.state]);

  useEffect( () =>{

    if(loggedInUserId === userId){
      navigate('/profile');
    }
    else{
      // Fetch user
      const getUser = async () => {
        try {
          const userResponse = await fetchUser(userId);

          setFetchedUser(userResponse);

          const profilePicKey = userResponse.profilePictureKey;

          if(profilePicKey){
            const imagePromises = await getImages(profilePicKey)

            const resolvedImages = imagePromises;
            setProfilePicture(resolvedImages.images[0]);
          }

          setLoading(false);

        } catch (error) {
          console.error('Error fetching the user:', error);
        }
      };

      getUser();
    }
  }, [userId, loggedInUserId, navigate]);

  const handleMessageSeller = async () => {

    if(!loggedInUserId){
      navigate(location.pathname, {replace: true, state: { alert: "You must login!" } });
      return null;
    }

    try{
      // Create conversation
      const conversation = await createConversation(loggedInUserId, userId);
      console.log("this is the conversation: ", conversation);
      navigate(`/messages/${conversation._id}`);
    }catch(error){
      console.error("Error creating conversation:", error);
    }
  };

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
      <h2>{fetchedUser.firstName}'s profile</h2>
      <div className='profile-container'>
        <div className='profile-pic'>
          <img src={profilePicture? profilePicture.content: profilePic}  alt='Profile' />
        </div>
        <div className='profile-info'>
          <h2>{fetchedUser.firstName} {fetchedUser.lastName}</h2>
          <p>{fetchedUser.email}</p>
          <p>Campus: {fetchedUser.campus} </p>
        </div>
        <button className='edit-btn' style={{backgroundColor: "#51B747"}} onClick={handleMessageSeller} > Message {fetchedUser.firstName}</button>
      </div>
      <div className='about-container'>
        <div className='about-info' style={{marginRight: "auto"}}>
          <h3>About</h3>
          <p>{fetchedUser.about}</p>
        </div>
      </div>
      <div className='my-listings-container'>
        <h3>{fetchedUser.firstName}'s listings</h3>
        <button className='edit-btn' onClick={handleSeeUserListings}> See <FaArrowRightLong/></button>
      </div>
    </div>
  )
}

export default UserPage