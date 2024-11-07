import React, { useRef, useEffect } from 'react'
import './RatingsSection.css'

import Rating from '../Rating/Rating';

import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { useState } from 'react';

const RatingsSection = () => {
  const nbrOfRatings = 5;
  const [itemsPerView, setItemsPerView] = useState(null);
  const slideStep = 100 / nbrOfRatings;
  const slider = useRef();

  const [index, setIndex] = useState(0);
  const [translateX, setTranslateX] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 670) {
        setItemsPerView(1);
      } 
      else if (window.innerWidth <= 900) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    // Set the initial itemsPerView and add an event listener for resizing
    handleResize();
    window.addEventListener('resize', handleResize);

    // Clean up the event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const slideForward = () => {
    if (index < nbrOfRatings - itemsPerView) {
      setIndex((prevIndex) => prevIndex + 1);
      setTranslateX((prevTranslateX) => prevTranslateX - slideStep);
    }
  };

  const slideBackwards = () => {
    if (index > 0) {
      setIndex((prevIndex) => prevIndex - 1);
      setTranslateX((prevTranslateX) => prevTranslateX + slideStep);
    }
  };

  useEffect(() => {
    slider.current.style.transform = `translateX(${translateX}%)`;
  }, [translateX]);

  return (
    <div className='ratings'>
      <div className='ratings-top'>
        <h1>Trusted by Students</h1>
      </div>
      <div className='ratings-bottom'>
        <FaArrowLeft
          className={`btn-back ${index === 0 ? 'disabled' : ''}`}
          onClick={slideBackwards}
        />
        <FaArrowRight
          className={`btn-next ${index >= (nbrOfRatings - itemsPerView) ? 'disabled' : ''}`}
          onClick={slideForward}
        />
        <div className="slider">
          <ul ref={slider} 
            style={{
              width: `${(nbrOfRatings / itemsPerView) * 100}%` // Set width dynamically based on number of ratings
            }}>
            <li>
              <Rating stars={5} title='Amazing Platform' description="This marketplace has made it so easy to buy and sell items on campus."/>
            </li>
            <li>
              <Rating stars={4} title='Very Convenient' description="I love how simple it is to post listings. Highly recommended!"/>
            </li>
            <li>
              <Rating stars={4} title='Great Experience' description="I've met so many new people and bought so many great things!"/>
            </li>
            <li>
              <Rating stars={3} title='Great!' description="Really liked it!."/>
            </li>
            <li>
              <Rating stars={3} title='Great!' description="Really liked it!."/>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default RatingsSection

