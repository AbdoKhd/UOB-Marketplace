import React, { useState, useEffect, useRef} from 'react';
import './ChatBox.css'

import profilePic from '../../Assets/default-profile-pic.png'
import { useNavigate } from 'react-router-dom';

import { getImages } from '../../Services/imageService';

import { useAuth } from '../../Components/AuthContext';
import { fetchMessages, sendMessage } from '../../Services/messagingService';

import { SocketProvider, useSocket } from '../../socketContext'

const ChatBox = (conversation, key) => {
  // Key here recreates a new ChatBox component everytime conversation changes.

  const convo = conversation.conversation;

  const socket = useSocket();
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
        }

      }catch(error){
        console.error('Error fetching profile pic in convo container:', error);
      }
    }

    fetchProfilePic();
  }, [convo]);


  // Fetch messages when the conversation changes
  useEffect(() => {
    if (convo && socket) {

      const roomId = convo._id; // Using conversation ID as the room ID

      const fetchConvoMessages = async () => {
        if(!messages || messages.length == 0){
          try {
            const convoMessages = await fetchMessages(convo._id);
            setMessages(convoMessages);


            //Join convo room after messages have been fetched

            // Preserve existing queries and add roomId
            socket.io.opts.query = { ...socket.io.opts.query, roomId };

            socket.emit('joinRoom', {roomId: roomId, userId: loggedInUserId});
            console.log("joined convo room!");
            
            // Emitting markAsSeen after fetching the messages
            if (convoMessages.length > 0) {
              socket.emit("markAsSeen", { userSeingId: loggedInUserId, otherUserId: otherParticipantId ,conversationId: convo._id });
            }
          } catch (error) {
            console.error('Error fetching messages:', error);
          } finally {
            setLoadingMessages(false);
          }
        }
      };
      fetchConvoMessages();

      // 'fetchMessages' will be emitted from the backend when a user rejoins the convo room
      const handleFetchMessagesAgain = (userId) => {
        if(userId.userId === loggedInUserId){
          console.log("fetching messages again after rejoining");
          fetchConvoMessages();
        }
      };
      socket.on('fetchMessagesAgain', handleFetchMessagesAgain);

      // Listen for new messages within the room
      const handleMessage = (message) => {
        console.log("new message in chatBox: ", message);
        if (message.conversationId === roomId) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      };
      socket.on('roomMessage', handleMessage);

      const handleStatusUpdate = ({ userSeingId, status }) => {
  
        setMessages((prevMessages) => {
          let foundSeen = false;
          return prevMessages
            .slice()
            .reverse()
            .map((msg) => {
              if (foundSeen) return msg; // Stop updating once a seen message is found
              if (msg.senderId !== userSeingId && msg.status === "seen") return msg;
              if (msg.senderId !== userSeingId && msg.status === "sent") return { ...msg, status };
              return msg;
            })
            .reverse();
        });
      };
      socket.on("messageStatusUpdate", handleStatusUpdate);

      // Cleanup on unmount or conversation change
      return () => {
        socket.off('roomMessage', handleMessage);
        socket.off("messageStatusUpdate", handleStatusUpdate);
        socket.off("fetchMessagesAgain", handleFetchMessagesAgain);
      };
    }
  }, [convo]);

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
        status: "sent",
      };

      // Emit the message to the room
      socket.emit("sendMessageToRoom", { roomId: convo._id, message: messageData });

      setNewMessage('');

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Handle key press in the input field
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      if (event.shiftKey) {
        // Shift + Enter should insert a new line
        event.preventDefault(); // Prevent default form submission behavior
        setNewMessage((prev) => prev + "\n");
      } else {
        handleSendMessage(); // Send the message on desktop
      }
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
              <img src={(ppKey && ppKey !== "") ? profilePicture.content : profilePic} alt='' />
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
          <textarea
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows="1" // Auto-expandable
          />
          <button onMouseDown={(e) => e.preventDefault()}>Send</button>
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
              <img src={(ppKey && ppKey !== "") ? profilePicture.content : profilePic} alt='' />
            </div>
            <p>{otherParticipantName}</p>
          </div>
        </div>
        <div className="messages-container">
          <p>No messages yet. Send one!</p>
        </div>
        <div className="message-input-container">
          <textarea
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows="1" // Auto-expandable
          />
          <button onMouseDown={(e) => e.preventDefault()} onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    )  
  }
  
  return (
    <div className='chat-box'>
      <div className='chat-box-top'>
        <div className='pp-and-name' style={{cursor: "pointer"}} onClick={goToUser}>        
          <div className='profile-pic' style={{height: "50px", width: "50px", marginRight: "15px"}}>
            <img src={(ppKey && ppKey !== "") ? profilePicture.content : profilePic} alt='' />
          </div>
          <p>{otherParticipantName}</p>
        </div>
      </div>
      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message-container ${message.senderId === loggedInUserId ? 'my-message-container' : 'other-message-container'}`}>
            <div className={`message ${message.senderId === loggedInUserId ? 'my-message' : 'other-message'}`}>
              <p>{message.content}</p>
              {message.senderId === loggedInUserId && <span className="message-status">{message.status}</span>}
            </div>
          </div>
          
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="message-input-container">
        <textarea
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows="1" // Auto-expandable
        />
        <button onMouseDown={(e) => e.preventDefault()} onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  )
}

export default ChatBox