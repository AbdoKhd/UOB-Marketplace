import React from 'react'
import './FooterSection.css'
import logo from '../../Assets/UOB-logo.png'

const FooterSection = () => {
  return (
    <div className='footer'>
      <div className='footer-left'>
        <img src={logo} alt="" className='logo'/>
        <p>Buy, sell, and rent.</p>
      </div>
      <div className='footer-right'>
        <div className='col'>
          <h2>Sections</h2>
          <p>Content</p>
          <p>Listings</p>
          <p>Features</p>
          <p>Showcase</p>
        </div>
        <div className='col'>
          <h2>Social Media</h2>
          <p>Instagram</p>
          <p>TikTok</p>
          <p>Facebook</p>
          <p>LinkedIn</p>
        </div>
        <div className='col'>
          <h2>Contact Us</h2>
          <p>abdrahman.khodr@std.balamand.edu.lb</p>
        </div>
      </div>
    </div>
  )
}

export default FooterSection