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
        <p>Welcome to UOB Marketplace, the ultimate online platform tailored exclusively for the University
        of Balamand (UOB) community. Our marketplace is designed to facilitate a seamless buying, selling, 
        and trading experience for students, faculty, and staff, all within the secure environment of our 
        university.</p>
        <p>At UOB Marketplace, we provide a platform where students can easily buy, sell, or rent a wide 
        range of items and services tailored to university life. Whether you're in need of textbooks for 
        your upcoming courses, looking to sell your old laptop, or searching for previous exams and study 
        notes to ace your tests, you'll find it all here. Students can also sell or buy dorm essentials 
        like furniture, kitchen utilities, or even clothing and accessories. If you're moving in or out 
        of a dorm, finding affordable and convenient options for utilities is simple on our marketplace. 
        Moreover, services like tutoring, offering academic help in subjects you're struggling with, or 
        renting equipment for personal or academic use are readily available.</p>  
      </div>
    </div>
  )
}

export default AboutSection