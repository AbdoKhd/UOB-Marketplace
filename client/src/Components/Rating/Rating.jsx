import React from 'react'
import './Rating.css'

const Rating = ({stars, title, description}) => {

  const renderStars = () => {
    let starElements = [];
    for (let i = 0; i < 5; i++) {
      starElements.push(
        <span key={i} className={`star ${i < stars ? 'filled' : ''}`}>&#9733;</span>
      );
    }
    return starElements;
  };


  return (
    <div className='rating'>
      <div className='stars'>
        {renderStars()}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

export default Rating

