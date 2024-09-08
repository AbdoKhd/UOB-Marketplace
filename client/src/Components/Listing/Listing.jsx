import React, { useState } from 'react'
import './Listing.css'

import { FaRegHeart, FaHeart} from "react-icons/fa";
import { LuMessageSquare } from "react-icons/lu";

import ps from '../../Assets/ps5.jpg'

const Listing = () => {

  const [isLiked, setIsLiked] = useState(false)

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className='listing'>
      <img src={ps} alt="" className='image'/>
      <div className='text'>
        <h3 className='text-title'>Ps5 slim</h3>
        <p className='text-price'>$305</p>
        <div className='icons'>
          {isLiked ? (
            <FaHeart className='icon' onClick={toggleLike} />
          ) : (
            <FaRegHeart className='icon' onClick={toggleLike} />
          )}
          <LuMessageSquare className='icon'/>
        </div>
      </div>
    </div>
  )
}

export default Listing
