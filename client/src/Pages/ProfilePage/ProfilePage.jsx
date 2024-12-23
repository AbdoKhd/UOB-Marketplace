import './ProfilePage.css'
import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Components/AuthContext';
import { fetchUser, editUserAbout, editUser } from '../../Services/userService';
import { getImages, uploadImages } from '../../Services/imageService';

import { FaArrowRightLong, FaPen } from "react-icons/fa6";
import NavBar from '../../Components/NavBar/NavBar';
import profilePic from '../../Assets/default-profile-pic.png'

import ScrollToTop from '../../Components/ScrollToTop/ScrollToTop';

const ProfilePage = () => {

  const navigate = useNavigate();

  const {logout, loggedInUserId} = useAuth();

  const [loggedInUser, setLoggedInUser] = useState();

  const [profilePicture, setProfilePicture] = useState("");

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [showAboutPopup, setShowAboutPopup] = useState(false);

  const [editingUserLoading, setEditingUserLoading] = useState(false);
  const [newFirstName, setNewFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [newCampus, setNewCampus] = useState("");
  const [newProfilePicture, setNewProfilePicture] = useState();

  const [editingAboutLoading, setEditingAboutLoading] = useState(false);
  const [newAbout, setNewAbout] = useState("");

  const [editingUserErrorMessage, setEditingUserErrorMessage] = useState("");
  const [editingAboutErrorMessage, setEditingAboutErrorMessage] = useState("");

  const [loading, setLoading] = useState(true);



  // Edit User info popup
  const handleEditUserButton = () => {
    setShowUserPopup(true);
    setNewFirstName(loggedInUser.firstName);
    setNewLastName(loggedInUser.lastName);
    setNewCampus(loggedInUser.campus);
  };

  const confirmEditUser = async () => {
    if(!newFirstName || !newLastName){
      if (!newFirstName) setFirstNameError(true);
      if (!newLastName) setLastNameError(true);
    }
    else{
      console.log("new first name: ", newFirstName);
      console.log("new last name: ", newLastName);
      console.log("new campus: ", newCampus);
      console.log("profile pic before upload: ", newProfilePicture);


      try {
        setEditingUserLoading(true);

        let imageKey = "";
        if(newProfilePicture){
        
          // Prepare FormData
          const formData = new FormData();
          formData.append('images', newProfilePicture);

          // Send POST request with FormData
          const imageResponse = await uploadImages(formData);
          
          imageKey = imageResponse.imageKeys[0];

        }

        console.log("this is the key of the image: ", imageKey);

        // Make a POST request to edit user
        const response = await editUser(loggedInUserId, imageKey, newFirstName, newLastName, newCampus);

        if(response.status === 200){
          setEditingUserLoading(false);
          setShowUserPopup(false);
        }
  
      } catch (error) {
        // Handle any errors
        setEditingUserLoading(false);
        console.error('There was an error editing the user!', error);
        setEditingAboutErrorMessage("Editing the user has failed. Please try again.");
      }

    }
  };

  const cancelEditUser = () => {
    setShowUserPopup(false);
    setNewFirstName("");
    setNewLastName("");
    setNewCampus("");
    setNewProfilePicture();
  };

  function handleFirstNameChange(event){
    const value = event.target.value;

    if(value.length <= 50){
      setNewFirstName(value);
      setFirstNameError(false);
    }
  }

  function handleLastNameChange(event){
    const value = event.target.value;

    if(value.length <= 50){
      setNewLastName(value);
      setLastNameError(false);
    }
  }

  function handleCampusChange(event){
    setNewCampus(event.target.value);
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewProfilePicture(file);
    }
  };

  //-----------
  // Edit About popup

  const handleEditAboutButton = () => {
    setShowAboutPopup(true);
    setNewAbout(loggedInUser.about);
  };

  function handleAboutChange(event){
    const value = event.target.value;

    setNewAbout(value);
    
  }

  const confirmEditAbout = async () => {

    try {
      setEditingAboutLoading(true);

      // Make a POST request to edit user's about
      const response = await editUserAbout(loggedInUserId, newAbout);

      if(response.status === 200){
        setEditingAboutLoading(false);
        setShowAboutPopup(false);
      }

    } catch (error) {
      // Handle any errors
      setEditingAboutLoading(false);
      console.error(`There was an error editing the user's about!`, error);
      setEditingAboutErrorMessage("Editing the user's about has failed. Please try again.");
    }


  };

  const cancelEditAbout = () => {
    setNewAbout("");
    setShowAboutPopup(false);
  };

  //-----------
  // Logout popup

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
    navigate(`/otherListings/My listings/${loggedInUserId}`);
  }

  const handleSeeMyFavorites = () =>{
    navigate(`/otherListings/My Favorites/${loggedInUserId}`);
  }

  useEffect(() =>{
    const fetchLoggedInUser = async () => {
      try{
        const user = await fetchUser(loggedInUserId);
        setLoggedInUser(user);

        const profilePicKey = user.profilePictureKey;

        if(profilePicKey){
          const resolvedImages = await getImages(profilePicKey);
          setProfilePicture(resolvedImages.images[0]);
        }

        setLoading(false);

      }catch(error){
        console.error('Error fetching logged in user:', error);
        setLoading(false);
      }
    }

    fetchLoggedInUser();
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
          <img src={profilePicture.content || profilePic} alt='Profile' />
        </div>
        <div className='profile-info'>
          <h2>{loggedInUser.firstName} {loggedInUser.lastName}</h2>
          <p>{loggedInUser.email}</p>
          <p>Campus: {loggedInUser.campus} </p>
        </div>
        <button className='edit-btn' onClick={handleEditUserButton}> Edit <FaPen/></button>
      </div>
      <div className='about-container'>
        <div className='about-info'>
          <h3>About</h3>
          <p>{loggedInUser.about}</p>
        </div>
        <button className='edit-btn' onClick={handleEditAboutButton}> Edit <FaPen/></button>
      </div>
      <div className='my-listings-container'>
        <h3>My listings</h3>
        <button className='edit-btn' onClick={handleSeeMyListings}> See <FaArrowRightLong/></button>
      </div>
      <div className='my-listings-container'>
        <h3>My favorites</h3>
        <button className='edit-btn' onClick={handleSeeMyFavorites}> See <FaArrowRightLong/></button>
      </div>
    
      <button onClick={handleLogoutButton} className='logout-btn'>LOGOUT</button>

      {showLogoutPopup && (
      <>
        <div className='overlay' onClick={cancelLogout}></div>
        <div className='logout-popup'>
          <p>Are you sure you want to log out?</p>
          <div className='buttons'>
            <button onClick={confirmLogout}>Yes</button>
            <button onClick={cancelLogout}>No</button>
          </div>
        </div>
      </>
      )}

      {showUserPopup && (
      <>
        <div className='overlay' onClick={cancelEditUser}></div>
        <div className='logout-popup' style={{width: "80%"}}>
          <div className='profile-pic' style={{cursor: "pointer"}} onClick={() => document.getElementById('fileInput').click()}>
            <img src={newProfilePicture ? URL.createObjectURL(newProfilePicture) : profilePicture.content || profilePic}  alt=''/>
            <input
              type="file"
              id="fileInput"
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
          <input style={{marginTop: "20px"}} type="text" placeholder="First name" value={newFirstName} onChange={handleFirstNameChange} className={`title-input ${firstNameError ? 'error' : ''}`} maxLength={50}></input>
          <input style={{marginTop: "20px"}} type="text" placeholder="Last name" value={newLastName} onChange={handleLastNameChange} className={`title-input ${lastNameError ? 'error' : ''}`} maxLength={50}></input>
          <select style={{marginTop: "20px"}} className={`category-select`} value={newCampus} onChange={handleCampusChange}>
            <option value="">Select a Campus</option>
            <option value="Balamand - Al Kurah">Balamand - Al Kurah</option>
            <option value="Souk Al Gharb - Aley">Souk Al Gharb - Aley</option>
            <option value="Beino - Akkar">Beino - Akkar</option>
            <option value="Dekouaneh">Dekouaneh</option>
          </select>

          {editingAboutErrorMessage && <p style={{marginTop: "20px"}} className="error-message">{editingAboutErrorMessage}</p>}

          <div className='buttons'>
            <button style={{marginRight: "auto"}} onClick={cancelEditUser}>Cancel</button>
            <button onClick={confirmEditUser}>Done</button>
          </div>
        </div>
      </>
      )}

      {showAboutPopup && (
      <>
        <div className='overlay' onClick={cancelEditAbout}></div>
        <div className='logout-popup' style={{width: "80%"}}>
          <textarea 
            placeholder="About you..." 
            className='description-textarea' 
            value={newAbout}
            onChange={handleAboutChange} 
            rows="5"
          ></textarea>
          <div className='buttons'>
            <button style={{marginRight: "auto"}} onClick={cancelEditAbout}>Cancel</button>
            <button onClick={confirmEditAbout}>Done</button>
          </div>
        </div>
      </>
      )}
    </div>
  )
}

export default ProfilePage