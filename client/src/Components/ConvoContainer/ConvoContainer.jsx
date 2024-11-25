import React from 'react'
import './ConvoContainer.css'

import profilePic from '../../Assets/default-profile-pic.png'

const ConvoContainer = ({ name, lastMessage, isSelected , onClick}) => {
  return (
    <div className={`convo-container ${isSelected ? 'selected' : ''}`} onClick={onClick}>
      <div className='pp-container'>
        <div className='profile-pic' style={{height: "60px", width: "60px"}}>
          <img src={profilePic} alt='Profile' />
        </div>
      </div>
      <div className='info'>
        <h3>{name}</h3>
        <p>{lastMessage}</p>
      </div>
    </div>
  )
}

export default ConvoContainer