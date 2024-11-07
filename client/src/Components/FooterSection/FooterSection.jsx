import React from 'react'
import './FooterSection.css'
import logo from '../../Assets/UOB-logo.png'
import {Link} from 'react-scroll'

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
          <p><Link to='hero' smooth={true} offset={0} duration={500}>Home</Link></p>
          <p><Link to='cta' smooth={true} offset={-300} duration={500}>Get Started</Link></p>
          <p><Link to='about' smooth={true} offset={-180} duration={500}>About Us</Link></p>
          <p><Link to='features' smooth={true} offset={-350} duration={500}>Features</Link></p>
          <p><Link to='ratings' smooth={true} offset={-150} duration={500}>Ratings</Link></p>
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