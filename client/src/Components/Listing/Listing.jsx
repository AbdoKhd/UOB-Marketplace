import React, { useState } from 'react'
import './Listing.css'

import { FaRegHeart, FaHeart} from "react-icons/fa";
import { LuMessageSquare } from "react-icons/lu";

const Listing = ({listingId, title, category, description, price}) => {

  const [isLiked, setIsLiked] = useState(false);

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className='listing'>
      <img src='' alt="" className='image'/>
      <div className='text'>
        <h3 className='text-title'>{title}</h3>
        <p className='text-price'>${price}</p>
      </div>
      <div className='icons'>
          {isLiked ? (
            <FaHeart className='icon' onClick={toggleLike} />
          ) : (
            <FaRegHeart className='icon' onClick={toggleLike} />
          )}
          <LuMessageSquare className='icon'/>
        </div>
    </div>
  )
}

export default Listing

