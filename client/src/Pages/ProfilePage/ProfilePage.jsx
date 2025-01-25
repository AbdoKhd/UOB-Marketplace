import './ProfilePage.css'
import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Components/AuthContext';
import { fetchUser, editUserAbout, editUser } from '../../Services/userService';
import { getImages, uploadImages, deleteImages } from '../../Services/imageService';

import { FaArrowRightLong, FaPen } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
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
    setNewProfilePicture(profilePicture);
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

        console.log("this is new pp: ", newProfilePicture);

        setEditingUserLoading(true);

        let newImageKey = loggedInUser.profilePictureKey || "";

        if(newProfilePicture !== profilePicture){
          // pp has changed so old pp needs to be deleted from the S3 bucket and new one needs to be uploaded

          if(newProfilePicture){

            // UPLOADING NEW PP TO S3---------
            // Prepare FormData
            const formData = new FormData();
            formData.append('images', newProfilePicture.file);

            // Send POST request to upload to S3 with FormData
            const imageResponse = await uploadImages(formData);
            
            newImageKey = imageResponse.imageKeys[0];
            //---------------------------------

          }
          else{
            newImageKey = "";
          }


          // DELETING OLD PP FROM S3--------
          if(loggedInUser.profilePictureKey && loggedInUser.profilePictureKey !== ""){

            const deleteImageResponse = await deleteImages(loggedInUser.profilePictureKey);
          }
          // -------------------------------

        }
        // pp hasn't been changed so no need to upload anything to the S3 bucket

        // Make a POST request to edit user
        const response = await editUser(loggedInUserId, newImageKey, newFirstName, newLastName, newCampus);

        if(response.status === 200){
          setEditingUserLoading(false);
          setShowUserPopup(false);
        }

        // Refresh the entire page
        window.location.reload();
  
      } catch (error) {
        // Handle any errors
        setEditingUserLoading(false);
        console.error('There was an error editing the user!', error);
        setEditingAboutErrorMessage("Editing the user has failed. Please try again.");
      }

    }
  };

  const cancelEditUser = () => {
    if(!editingUserLoading){
      setShowUserPopup(false);
      setNewFirstName("");
      setNewLastName("");
      setNewCampus("");
      setNewProfilePicture();
      setFirstNameError(false);
      setLastNameError(false);
    }
  };

  const emptyNewPp = () =>{
    setNewProfilePicture();
  }

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
      const imageUrl = URL.createObjectURL(file); // Create a URL for the image
      setNewProfilePicture({ file, content: imageUrl }); // Store both the file and its URL
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

      // Refresh the entire page
      window.location.reload();

    } catch (error) {
      // Handle any errors
      setEditingAboutLoading(false);
      console.error(`There was an error editing the user's about!`, error);
      setEditingAboutErrorMessage("Editing the user's about has failed. Please try again.");
    }


  };

  const cancelEditAbout = () => {
    if(!editingAboutLoading){
      setNewAbout("");
      setShowAboutPopup(false);
    }
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
    navigate(`/otherListings/${loggedInUserId}/Listings`);
  }

  const handleSeeMyFavorites = () =>{
    navigate(`/otherListings/${loggedInUserId}/Favorites`);
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

  // Disable scrolling when a popup is visible.
  useEffect(() => {
    const isPopupVisible = showLogoutPopup || showUserPopup || showAboutPopup;
    if (isPopupVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showLogoutPopup, showUserPopup, showAboutPopup]);

  // Handle loading and null checks
  if (loading) {
    return (
      <div className='profile-page'>
        <NavBar/>
        <div className='spinner-wrapper'>
          <div className='spinner'></div>
        </div>
      </div>
    )  
  }

  if (!loggedInUser) {
    return (
      <div className='profile-page'>
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
          <div className='pp-and-trash'>
            <div className='profile-pic' style={{cursor: "pointer"}} onClick={() => document.getElementById('fileInput').click()}>
              <img src={newProfilePicture && newProfilePicture.content || profilePic}  alt=''/>
              <input
                type="file"
                id="fileInput"
                style={{ display: 'none' }}
                accept=".png, .jpeg, .jpg"
                onChange={handleImageUpload}
              />
            </div>
            <FaTrash className='trash-icon' style={{cursor:"pointer", fontSize:"20px", color:"#D62828"}} onClick={emptyNewPp}/>
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

          {editingUserErrorMessage && <p style={{marginTop: "20px"}} className="error-message">{editingUserErrorMessage}</p>}

          {editingUserLoading ? (
            <div className='spinner' style={{marginBottom:"0px", marginTop:"30px"}}></div>
          ) : (
          <div className='buttons'>
            <button style={{marginRight: "auto"}} onClick={cancelEditUser}>Cancel</button>
            <button onClick={confirmEditUser}>Done</button>
          </div>
          )}
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

          {editingAboutErrorMessage && <p style={{marginTop: "20px"}} className="error-message">{editingAboutErrorMessage}</p>}

          {editingAboutLoading ? (
            <div className='spinner' style={{marginBottom:"0px", marginTop:"30px"}}></div>
          ) : (
          <div className='buttons'>
            <button style={{marginRight: "auto"}} onClick={cancelEditAbout}>Cancel</button>
            <button onClick={confirmEditAbout}>Done</button>
          </div>
          )}
        </div>
      </>
      )}
    </div>
  )
}

export default ProfilePage