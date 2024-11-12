import React, { useState } from 'react'
import './Listing.css'
import { useNavigate } from 'react-router-dom';

import { FaRegHeart, FaHeart} from "react-icons/fa";
import { LuMessageSquare } from "react-icons/lu";

const Listing = ({listingId, imageUrls, title, price}) => {

  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  const handleAddToFavorite = (event) => {
    event.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleMessageSeller = (event) => {
    event.stopPropagation();
  };

  const handleListingClick = () => {
    navigate(`/listingDetails/${listingId}`);
  }

  return (
    <div className='listing' onClick={handleListingClick}>
      <img src='' alt="" className='image'/>
      <div className='text'>
        <h3 className='text-title'>{title}</h3>
        <p className='text-price'>${price}</p>
      </div>
      <div className='icons'>
          {isLiked ? (
            <FaHeart className='icon' onClick={handleAddToFavorite} />
          ) : (
            <FaRegHeart className='icon' onClick={handleAddToFavorite} />
          )}
          <LuMessageSquare className='icon' onClick={handleMessageSeller}/>
        </div>
    </div>
  )
}

export default Listing

