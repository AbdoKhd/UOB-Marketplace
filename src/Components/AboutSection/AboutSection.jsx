import React from 'react'
import './AboutSection.css'
import Students from '../../Assets/two-students.png'

const AboutSection = () => {
  return (
    <div className='about'>
      <div className='about-left'>
        <img src={Students} alt="" className='about-img'/>
      </div>
      <div className='about-right'>
        <h3>About UOB Marketplace</h3>
        <h2>Connecting the UOB Community Through Commerce</h2>
        <p>
          Welcome to UOB Marketplace, the go-to platform for buying, selling, and trading within the University of 
          Balamand community. Whether you're a student, faculty, or staff, our secure marketplace makes it easy to 
          find or list textbooks, electronics, dorm essentials, study materials, and more. Need tutoring or academic 
          help? Looking to rent or sell items? UOB Marketplace connects you with trusted peers for a seamless exchange 
          experience. Join us and make campus life more convenient!
        </p>  
      </div>
    </div>
  )
}

export default AboutSection