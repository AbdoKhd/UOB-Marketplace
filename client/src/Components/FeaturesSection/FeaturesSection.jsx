import React from 'react'
import './FeaturesSection.css'
import { FaLock, FaUserCheck } from "react-icons/fa";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { FaCartShopping } from "react-icons/fa6";

const FeaturesSection = () => {
  return (
    <div className='features'>
      <div className='feature'>
        <FaLock className='icon'/>
        <h2>Secure</h2>
        <p>.edu authentication and buyer protection on purchases.</p>
      </div>
      <div className='feature'>
        <BsFillLightningChargeFill className='icon'/>
        <h2>Lightning-Fast</h2>
        <p>Post your first listing in under a minute.</p>
      </div>
      <div className='feature'>
        <FaUserCheck className='icon'/>
        <h2>Verified Students</h2>
        <p>Trade with other students, not strangers</p>
      </div>
      <div className='feature'>
        <FaCartShopping alt="" className='icon'/>
        <h2>Intuitive</h2>
        <p>List an item in a few simple steps. Message sellers with ease.</p>
      </div>
    </div>
  )
}

export default FeaturesSection