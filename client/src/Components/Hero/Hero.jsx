import React from 'react'
import './Hero.css'
import { FaArrowRightLong } from "react-icons/fa6";
import { NavLink } from 'react-router-dom';

const Hero = () => {
  return (
    <div className='hero'>
      <div className='hero-text'>
        <h1>Welcome to UOB Marketplace</h1>
        <p>Buy, Sell, and Exchange Goods and Services with the UOB Community.</p>
        <NavLink to='/listings' className='hero-btn'>
          Explore more
          <FaArrowRightLong className='arrow'/>
        </NavLink>
      </div>
    </div>
  )
}

export default Hero

