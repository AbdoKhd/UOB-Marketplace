import React, { useState, useEffect } from 'react'
import './Listing.css'
import { useNavigate } from 'react-router-dom';

import http from '../../http-common';
import { useAuth } from '../../Components/AuthContext';

import { FaRegHeart, FaHeart, FaSpinner} from "react-icons/fa";
import { LuMessageSquare } from "react-icons/lu";

import noImages from '../../Assets/no-image.jpg'

const Listing = ({listingId, image, title, price, isInFavorites}) => {

  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(isInFavorites);
  const navigate = useNavigate();
  const [editingFavorites, setEditingFavorites] = useState(false);

  const handleAddToFavorite = async (event) => {
    event.stopPropagation();
    try{
      if(!isLiked){
        // Add to favorites
        setEditingFavorites(true);
        const addListingToUserFavorites = await http.post(`/api/users/addListingToUser/myFavorites/${user.id}`, {
          listingId: listingId
        });
        setEditingFavorites(false);
        setIsLiked(true);
      }
      else{
        // Remove from favorites
        setEditingFavorites(true);
        const removeListingFromUserFavorites = await http.post(`/api/users/removeListingFromUser/myFavorites/${user.id}`, {
          listingId: listingId
        });
        setEditingFavorites(false);
        setIsLiked(false);
      }
    }catch(error){
      console.error("Error updating favorites:", error);
    }
  };

  const handleMessageSeller = (event) => {
    event.stopPropagation();
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

