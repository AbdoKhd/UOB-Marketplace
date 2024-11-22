import React, { useState, useEffect } from 'react';
import './ListingDetailsPage.css'
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import NavBar from '../../Components/NavBar/NavBar'
import { useAuth } from '../../Components/AuthContext';

import { addToFavorites, removeFromFavorites, fetchUser } from '../../Services/userService';
import { deleteListing, fetchListing } from '../../Services/listingService';
import { getImages } from '../../Services/imageService';

import profilePic from '../../Assets/default-profile-pic.png'

// Spinner
import {FaSpinner} from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";

// Slider
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import ScrollToTop from '../../Components/ScrollToTop/ScrollToTop';

const ListingDetailsPage = () => {

  const { loggedInUserId } = useAuth();
  const navigate = useNavigate();
  const {listingId}  = useParams();
  const [listing, setListing] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listingUserId, setListingUserId] = useState();

  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const [isLiked, setIsLiked] = useState(false);
  const [editingFavorites, setEditingFavorites] = useState(false);

  const [profilePicture, setProfilePicture] = useState();

  const confirmDelete = () => {
    handleDeleteListing();
  };

  const cancelDelete = () => {
    setShowDeletePopup(false);
  };

  const showDeletePopupFun = () => {
    setShowDeletePopup(true);
  };

  const goToUser = () =>{
    navigate(`/user/${listingUserId}`)
  }

  const handleBtnFavorite = async (event) =>{
    if(!loggedInUserId){
      return null;
    }
    try{
      if(!isLiked){
        // Add to favorites
        setEditingFavorites(true);
        const addListingToUserFavorites = await addToFavorites(loggedInUserId, listingId);
        setEditingFavorites(false);
        setIsLiked(true);
      }
      else{
        // Remove from favorites
        setEditingFavorites(true);
        const removeListingFromUserFavorites = await removeFromFavorites(loggedInUserId, listingId);
        setEditingFavorites(false);
        setIsLiked(false);
      }
    }catch(error){
      console.error("Error updating favorites:", error);
    }
  }

  // Delete the listing
  const handleDeleteListing = async (event) =>{
    try{
      const deleteListingResponse = await deleteListing(listingId);

      navigate('/listings', { state: { notification: 'Listing deleted successfully!' } });

    }catch(error){
      console.error("Error deleting listing:", error);
    }
  }

  // Some media query here--------
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 490);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 490);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // -----------------------------

  useEffect(() => {

    // Fetch user's favorites
    const fetchUserFavorites = async () => {
      if(!loggedInUserId){
        return null;
      }
      try {
        const user = await fetchUser(loggedInUserId);

        if(user.myFavorites.includes(listingId)){
          setIsLiked(true);
        }

      } catch (error) {
        console.error('Error fetching the user favorites:', error);
      }
    };
  
    // Fetch listing
    const getListing = async () => {
      try {
        const fetchedListing = await fetchListing(listingId);

        setListing(fetchedListing.listing);

        const listing = fetchedListing.listing;

        setListingUserId(listing.user._id);

        const user = listing.user;

        const profilePicKey = user.profilePictureKey;

        if(profilePicKey){
          const imagePromises = await getImages(profilePicKey);

          const resolvedImages = imagePromises;
          setProfilePicture(resolvedImages.images[0]);
        }

        if (listing.imagesKey && listing.imagesKey.length > 0) {
          const imageResponse = await getImages(listing.imagesKey);
          setImages(imageResponse.images);
        }

        setLoading(false);

      } catch (error) {
        console.error('Error fetching listing or images:', error);
        setLoading(false);
      }
    };

    fetchUserFavorites();
    getListing();
  }, [listingId]);

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

  if (!listing) {
    return (
      <div>
        <NavBar/>
        <div className='spinner-wrapper'>
          <p>Listing not found</p>;
        </div>
      </div>
    )
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className='listing-details-page'>
      <ScrollToTop/>
      <NavBar/>
      <div className='top'>
        <div className='slider-container'>
          {images && images.length > 0 ? (
            images.length > 1 ? (
              <Slider className='my-slider' {...settings}>
                {images.map((image, index) => (
                  <div key={index}>
                    <img src={image.content} alt='' />
                  </div>
                ))}
              </Slider>
            ) : (
              // Directly render a single image without using the slider
              <div className='one-image-container'>
                <img src={images[0].content} alt='' />
              </div>
            )
          ) : (
            <p className='no-images-container'>No images available</p>
          )}
        </div>
        <div className='listing-info'>
          <h2>{listing.title}</h2>
          <div className='divider'></div>
          <p><strong>Category:</strong> {listing.category}</p>
          <div className='divider'></div>
          <p><strong>Description:</strong> {listing.description}</p>
          <div className='divider'></div>
          <p><strong>Price:</strong> ${listing.price}</p>
        </div>
      </div>
      <div className='other'>
        {listingUserId === loggedInUserId ? (
          <div className='my-listing'>
            {editingFavorites ?
            <FaSpinner className='icon spinner-favorite' />
            : isLiked ? 
              <button className='remove-from-favorites-btn' onClick={handleBtnFavorite}>
                Remove from favorites
              </button>
            : <button className='add-to-favorites-btn' onClick={handleBtnFavorite}>Add to favorites</button>}
            <button className='delete-btn' onClick={showDeletePopupFun}>Delete listing</button>
          </div>
        ):(
          <div className='not-my-listing'>
            {editingFavorites ?
            <FaSpinner className='icon spinner-favorite' />
            : isLiked ? 
              <button className='remove-from-favorites-btn' onClick={handleBtnFavorite}>
                Remove from favorites
              </button>
            : <button className='add-to-favorites-btn' onClick={handleBtnFavorite}>Add to favorites</button>}
            <div className='about-seller-container'>
              <div className='asc-top'>
                <h3>About the seller</h3>
                <button className='message-seller-btn'>{isSmallScreen ? <FaRegMessage style={{display : 'flex'}}/> : 'Message the seller'}</button>
              </div>
              <div className='asc-bottom'>
                <div className='profile-pic' onClick={goToUser} style={{cursor: 'pointer'}}>
                  <img src={profilePicture? profilePicture.content: profilePic} alt='Profile' />
                </div>
                <div className='profile-info'>
                  <h2>{listing.user.firstName} {listing.user.lastName}</h2>
                  <p>{listing.user.email}</p>
                  <p>Campus: {listing.user.campus}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showDeletePopup && (
      <>
        <div className='overlay'></div>
        <div className='logout-popup'>
          <p>Are you sure you want to delete this listing?</p>
          <div className='buttons'>
            <button onClick={confirmDelete}>Yes</button>
            <button onClick={cancelDelete}>No</button>
          </div>
        </div>
      </>
      )}
    </div>
  )
}

export default ListingDetailsPage