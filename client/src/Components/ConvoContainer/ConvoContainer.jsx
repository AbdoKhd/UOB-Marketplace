import React from 'react'
import './ConvoContainer.css'

import profilePic from '../../Assets/default-profile-pic.png'

import { getImages } from '../../Services/imageService';
import { useState, useEffect } from 'react';

const ConvoContainer = ({ name, ppKey, lastMessage, isSelected , onClick}) => {

  const [profilePicture, setProfilePicture] = useState("");

  useEffect(() =>{
    const fetchProfilePic = async () => {
      try{

        if(ppKey && ppKey !== ""){
          const resolvedImages = await getImages(ppKey);
          setProfilePicture(resolvedImages.images[0]);
        }

      }catch(error){
        console.error('Error fetching profile pic in convo container:', error);
      }
    }

    fetchProfilePic();
  }, []);

  return (
    <div className={`convo-container ${isSelected ? 'selected' : ''}`} onClick={onClick}>
      <div className='pp-container'>
        <div className='profile-pic' style={{height: "60px", width: "60px"}}>
          <img src={(ppKey && ppKey !== "") ? profilePicture.content : profilePic} alt='Profile' />
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