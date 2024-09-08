import React from 'react'
import './CTASection.css'
import stairsImage from '../../Assets/balamand-stairs.jpg'
import library from '../../Assets/balamand-library.jpg'
import libraryNight from '../../Assets/balamand-library-night.jpg'

import { FaUser } from "react-icons/fa";
import { MdSell} from "react-icons/md";
import { FaCartShopping } from "react-icons/fa6";


const CTASection = () => {
  return (
    <div className='cta'>
      <div className='actionContainer'>
        <img src={stairsImage} alt=''/>
        <div className="caption">
          <FaCartShopping className='icon'/>
          <p>Buy</p>
        </div>
      </div>
      <div className='actionContainer'>
        <img src={library} alt=''/>
        <div className="caption">
          <MdSell className='icon'/>
          <p>Sell</p>
        </div>
      </div>
      <div className='actionContainer'>
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

