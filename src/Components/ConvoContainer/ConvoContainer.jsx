import React from 'react'
import './ConvoContainer.css'

import profilePic from '../../Assets/default-profile-pic.png'

import { getImages } from '../../Services/imageService';
import { useState, useEffect } from 'react';
import { useAuth } from '../../Components/AuthContext';

const ConvoContainer = ({name, ppKey, lastMessage, lastMessageObj, unreadCount, isSelected , onClick}) => {

  let isSelectedConvo = isSelected;

  const { loggedInUserId } = useAuth();

  const [profilePicture, setProfilePicture] = useState("");

  const[isLastMessageRead, setIsLastMessageRead] = useState(false);


  useEffect(() =>{
    console.log("in convo container this is lastMessageObj: ", lastMessageObj);
    console.log("in convo container this is unreadCount: ", unreadCount);
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


  useEffect(() =>{
    // console.log("in convo container lastMessageObj: ", lastMessageObj);
    // console.log("isLastMessageRead: ", isLastMessageRead);
    
    if (!lastMessageObj) {
      setIsLastMessageRead(true);
      return;
    }
  
    if (isSelectedConvo) {
      //console.log("Marking message as read since conversation is selected.");
      setIsLastMessageRead(true);
    } else if (lastMessageObj.senderId !== loggedInUserId && lastMessageObj.status !== "seen") {
      //console.log("Marking message as unread.");
      setIsLastMessageRead(false);
    } else {
      //console.log("Marking message as read.");
      setIsLastMessageRead(true);
    }
  }, [isSelectedConvo, lastMessageObj]);

  return (
    <div className={`convo-container ${isSelectedConvo ? 'selected' : ''}`} onClick={onClick}>
      <div className='pp-container'>
        <div className='profile-pic' style={{height: "60px", width: "60px"}}>
          <img src={(ppKey && ppKey !== "") ? profilePicture.content : profilePic} alt='' />
        </div>
      </div>
      <div className={`info ${isLastMessageRead ? '' : 'unread'}`}>
        <h3>{name}</h3>
        <p>{lastMessage}</p>
      </div>
      {unreadCount > 0 && (
        <div className="unread-count-badge">
          <p>{unreadCount}</p>
        </div>
      )}
    </div>
  )
}

export default ConvoContainer