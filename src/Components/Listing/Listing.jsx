import React, { useState, useEffect } from 'react'
import './Listing.css'
import { useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from '../../Components/AuthContext';

import { addToFavorites, removeFromFavorites } from '../../Services/userService';
import { createConversation } from '../../Services/messagingService'
import { getImages } from '../../Services/imageService';

import { FaRegHeart, FaHeart, FaSpinner} from "react-icons/fa";
import { LuMessageSquare } from "react-icons/lu";

import noImages from '../../Assets/no-image.jpg'

const Listing = ({listingId, imageKey, title, price, isInFavorites, userId}) => {

  const { loggedInUserId } = useAuth();
  const [isLiked, setIsLiked] = useState(isInFavorites);
  const navigate = useNavigate();
  const location = useLocation();
  const [editingFavorites, setEditingFavorites] = useState(false);
  const [image, setImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      if (imageKey) {
        try {
          const response = await getImages(imageKey);
          setImage(response.images[0]);
        } catch (error) {
          // console.error("Error fetching image:", error);
        }
      }
      else{
        setLoadingImage(false);
      }
    };

    fetchImage();
  }, [imageKey]);

  const handleAddToFavorite = async (event) => {
    event.stopPropagation();
    if(!loggedInUserId){
      navigate(location.pathname, {replace: true, state: { alert: "You must login!" } });
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
      // console.error("Error updating favorites:", error);
    }
  };

  const handleMessageSeller = async (event) => {
    event.stopPropagation();

    if(!loggedInUserId){
      navigate(location.pathname, {replace: true, state: { alert: "You must login!" } });
      return null;
    }

    // console.log("this is the user of this listing: ", userId);
    if(loggedInUserId === userId){
      // console.log("You can't message yourself");
      navigate(location.pathname, {replace: true, state: { alert: "You can't message yourself!" } });
      //The replace option ensures that the current history entry is replaced with the new state, rather than adding a new entry to the backstack.
      return;
    }

    try{
      // Create conversation
      const conversation = await createConversation(loggedInUserId, userId);
      // console.log("this is the conversation: ", conversation);
      navigate(`/messages/${conversation._id}`);
    }catch(error){
      // console.error("Error creating conversation:", error);
    }
  };

  const handleListingClick = () => {
    navigate(`/listingDetails/${listingId}`);
  }

  return (
    <div className='listing' onClick={handleListingClick}>

      {imageKey ? (
        <div className='image-wrapper'>

          {loadingImage &&
          <div className='image-loading'>
            <FaSpinner className='icon spinner-favorite' style={{fontSize: 25}}/>
          </div>
          }
        
          <img
            src={image && image.content}
            alt=""
            className='image'
            style={{ display: loadingImage ? 'none' : 'block' }} // Hide image until loaded
            onLoad={() => setLoadingImage(false)} // Trigger when image is fully loaded
          />
          
        </div>
      ) : (
        <div className='image-wrapper'>
          <img
            src={noImages}
            alt=""
            className='image'
            style={{ display: loadingImage ? 'none' : 'block' }} // Hide image until loaded
          />
        </div>
      )}


      <div className='text'>
        <h3 className='text-title'>{title}</h3>
        {price === 0 ? (
          <p className='free-price'>Free</p>
        ): (<p className='text-price'>${price}</p>)}
        
      </div>
      <div className='icons'>
        {editingFavorites ? (
          <FaSpinner className='icon spinner-favorite' /> // Spinner icon with a class for animation
        ) : isLiked ? (
          <div className="icon-wrapper">
            <FaHeart className='icon' onClick={handleAddToFavorite} />
            <span className="listing-tooltip">Remove from favorites</span>
          </div>
        ) : (
          <div className="icon-wrapper">
            <FaRegHeart className='icon' onClick={handleAddToFavorite} />
            <span className="listing-tooltip">Add to favorites</span>
          </div>
        )}
        <div className="icon-wrapper">
          <LuMessageSquare className='icon' onClick={handleMessageSeller} />
          <span className="listing-tooltip">Message seller</span>
        </div>
      </div>
    </div>
  )
}

export default Listing

