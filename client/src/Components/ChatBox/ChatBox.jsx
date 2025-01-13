import React, { useState, useEffect, useRef} from 'react';
import './ChatBox.css'
import socket from "../../socket";
import profilePic from '../../Assets/default-profile-pic.png'
import { useNavigate } from 'react-router-dom';

import { getImages } from '../../Services/imageService';

import { useAuth } from '../../Components/AuthContext';
import { fetchMessages, sendMessage } from '../../Services/messagingService';

const ChatBox = (conversation, key) => {
  // Key here recreates a new ChatBox component everytime conversation changes.

  const convo = conversation.conversation;

  const navigate = useNavigate();
  const { loggedInUserId } = useAuth();
  const [profilePicture, setProfilePicture] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [loadingMessages, setLoadingMessages] = useState(true);

  const otherParticipant = convo.participants[0]._id === loggedInUserId
                  ? convo.participants[1]
                  : convo.participants[0];
  
  const ppKey = otherParticipant.profilePictureKey;

  const otherParticipantId = otherParticipant._id;

  const otherParticipantName = otherParticipant.firstName + " " + otherParticipant.lastName;

  useEffect(() =>{
    const fetchProfilePic = async () => {
      try{
        
        if(ppKey && ppKey !== ""){
          const resolvedImages = await getImages(ppKey);
          setProfilePicture(resolvedImages.images[0]);
          console.log("profilePicture in chatBox: ", resolvedImages.images[0]);
        }

      }catch(error){
        console.error('Error fetching profile pic in convo container:', error);
      }
    }

    fetchProfilePic();
  }, [convo]);

  // Fetch messages when the conversation changes
  useEffect(() => {
    if (convo) {
      socket.connect();

      //console.log("Current convo: ", convo._id);

      const fetchConvoMessages = async () => {
        try {
          const convoMessages = await fetchMessages(convo._id);
          setMessages(convoMessages);
        } catch (error) {
          console.error('Error fetching messages:', error);
        } finally {
          setLoadingMessages(false);
        }
      };
      fetchConvoMessages();


      // Listen for new messages for this conversation
      const handleMessage = (message) => {
        if (message.conversationId === convo._id) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      };
      socket.on('message', handleMessage);

      // Cleanup on unmount or conversation change
      return () => {
        socket.off('message', handleMessage);
      };
    }
  }, [conversation]);

  // Scroll to the bottom of the messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  //Send Message
  const handleSendMessage = async () => {

    if (!newMessage.trim()) return;

    try {
      const messageData = {
        senderId: loggedInUserId,
        receiverId: otherParticipantId,
        conversationId: convo._id,
        content: newMessage,
      };

      // Emit the message through Socket.IO
      socket.emit("sendMessage", messageData);

      setNewMessage('');

      await sendMessage(loggedInUserId, otherParticipantId, convo._id, newMessage);

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Handle key press in the input field
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const goToUser = () =>{
    navigate(`/user/${otherParticipantId}`);
  }

  // Handle loading and null checks
  if (loadingMessages) {
    return (
      <div className='chat-box'>
        <div className='chat-box-top'>
          <div className='pp-and-name' style={{cursor: "pointer"}} onClick={goToUser}>        
            <div className='profile-pic' style={{height: "50px", width: "50px", marginRight: "15px"}}>
              <img src={(ppKey && ppKey !== "") ? profilePicture.content : profilePic} alt='Profile' />
            </div>
            <p>{otherParticipantName}</p>
          </div>
        </div>
        <div className="messages-container">
          <div className='spinner-wrapper'>
            <div className='spinner'></div>
          </div>
        </div>
        <div className="message-input-container">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    )  
  }

  if (messages.length === 0) {
    return (
      <div className='chat-box'>
        <div className='chat-box-top'>
          <div className='pp-and-name' style={{cursor: "pointer"}} onClick={goToUser}>        
            <div className='profile-pic' style={{height: "50px", width: "50px", marginRight: "15px"}}>
              <img src={(ppKey && ppKey !== "") ? profilePicture.content : profilePic} alt='Profile' />
            </div>
            <p>{otherParticipantName}</p>
          </div>
        </div>
        <div className="messages-container">
          <p>No messages yet. Send one!</p>
        </div>
        <div className="message-input-container">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    )  
  }
  
  return (
    <div className='chat-box'>
      <div className='chat-box-top'>
        <div className='pp-and-name' style={{cursor: "pointer"}} onClick={goToUser}>        
          <div className='profile-pic' style={{height: "50px", width: "50px", marginRight: "15px"}}>
            <img src={(ppKey && ppKey !== "") ? profilePicture.content : profilePic} alt='Profile' />
          </div>
          <p>{otherParticipantName}</p>
        </div>
      </div>
      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.senderId === loggedInUserId ? 'my-message' : 'other-message'}`}
          >
            <p>{message.content}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="message-input-container">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  )
}

export default ChatBox