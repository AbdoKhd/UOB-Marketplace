import React from 'react'
import './RatingsSection.css'

import Rating from '../Rating/Rating';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const RatingsSection = () => {


  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
  };

  return (
    <div className='ratings'>
      <div className="ratings-left">
        <h1>Trusted by students</h1>
      </div>
      <div className="ratings-right">
        <Slider {...settings}>
          <Rating stars={5} title='Amazing Platform' description="This marketplace has made it so easy to buy and sell items on campus."/>
          <Rating stars={4} title='Very Convenient' description="I love how simple it is to post listings. Highly recommended!"/>
          <Rating stars={4} title='Great Experience' description="I've met so many new people and bought so many great things!"/>
          <Rating stars={3} title='Great!' description="Really liked it!."/>
          <Rating stars={0} title='Garbage' description="wtf is this shitty app"/>
          <Rating stars={3} title='Not bad' description="I like it but i don't think I'll use it much"/>
        </Slider>
      </div>
    </div>
  )
}

export default RatingsSection

