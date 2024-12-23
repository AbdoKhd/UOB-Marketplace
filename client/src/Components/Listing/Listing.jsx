import React, { useState, useEffect } from 'react'
import './Listing.css'
import { useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from '../../Components/AuthContext';

import { addToFavorites, removeFromFavorites } from '../../Services/userService';
import { createConversation } from '../../Services/messagingService'

import { FaRegHeart, FaHeart, FaSpinner} from "react-icons/fa";
import { LuMessageSquare } from "react-icons/lu";

import noImages from '../../Assets/no-image.jpg'

const Listing = ({listingId, image, title, price, isInFavorites, userId}) => {

  const { loggedInUserId } = useAuth();
  const [isLiked, setIsLiked] = useState(isInFavorites);
  const navigate = useNavigate();
  const location = useLocation();
  const [editingFavorites, setEditingFavorites] = useState(false);

  const handleAddToFavorite = async (event) => {
    event.stopPropagation();
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
  };

  const handleMessageSeller = async (event) => {
    event.stopPropagation();

    console.log("this is the user of this listing: ", userId);
    if(loggedInUserId === userId){
      console.log("You can't message yourself");
      navigate(location.pathname, { state: { alert: "You can't message yourself!" } });
      return;
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

  const handleListingClick = () => {
    navigate(`/listingDetails/${listingId}`);
  }

  return (
    <div className='listing' onClick={handleListingClick}>
      <img 
        src={image ? image.content : noImages}
        alt="" 
        className='image'
      />
      <div className='text'>
        <h3 className='text-title'>{title}</h3>
        <p className='text-price'>${price}</p>
      </div>
      <div className='icons'>
        {editingFavorites ? (
          <FaSpinner className='icon spinner-favorite' /> // Spinner icon with a class for animation
        ) : isLiked ? (
          <FaHeart className='icon' onClick={handleAddToFavorite} />
        ) : (
          <FaRegHeart className='icon' onClick={handleAddToFavorite} />
        )}
        <LuMessageSquare className='icon' onClick={handleMessageSeller} />
      </div>
    </div>
  )
}

export default Listing

