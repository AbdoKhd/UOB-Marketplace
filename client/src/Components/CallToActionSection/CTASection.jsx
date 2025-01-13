import React from 'react'
import './CTASection.css'
import stairsImage from '../../Assets/balamand-stairs.jpg'
import library from '../../Assets/balamand-library.jpg'
import libraryNight from '../../Assets/balamand-library-night.jpg'
import {useNavigate } from 'react-router-dom';
import { useAuth } from '../../Components/AuthContext';

import { FaUser } from "react-icons/fa";
import { MdSell} from "react-icons/md";
import { FaCartShopping } from "react-icons/fa6";


const CTASection = () => {

  const navigate = useNavigate();
  const { loggedInUserId } = useAuth();

  return (
    <div className='cta'>
      <div className='actionContainer' onClick={()=>{ navigate(`/listings/category/All/order/Newest First/campus/All/pgn/1`)} }>
        <img src={stairsImage} alt=''/>
        <div className="caption">
          <FaCartShopping className='icon'/>
          <p>Buy</p>
        </div>
      </div>
      <div className='actionContainer' onClick={()=>{ loggedInUserId ? navigate(`/sell`) : navigate(`/login`)} }>
        <img src={library} alt=''/>
        <div className="caption">
          <MdSell className='icon'/>
          <p>Sell</p>
        </div>
      </div>
      <div className='actionContainer' onClick={()=>{loggedInUserId ? navigate(`/profile`) : navigate(`/register`)} }>
        <img src={libraryNight} alt=''/>
        <div className="caption">
          <FaUser className='icon'/>
          <p>Create Your Account</p>
        </div>
      </div>
    </div>
  )
}

export default CTASection

