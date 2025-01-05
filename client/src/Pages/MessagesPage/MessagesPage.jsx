import React from 'react'
import {useState, useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import './MessagesPage.css'
import { useAuth } from '../../Components/AuthContext';

import { fetchConversations, fetchConversationById } from '../../Services/messagingService';

import NavBar from '../../Components/NavBar/NavBar';
import ScrollToTop from '../../Components/ScrollToTop/ScrollToTop';

import ConvoContainer from '../../Components/ConvoContainer/ConvoContainer';
import ChatBox from '../../Components/ChatBox/ChatBox';

const MessagesPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const {loggedInUserId} = useAuth();

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isChatsVisible, setIsChatsVisible] = useState(true);
  const [loadingConvos, setLoadingConvos] = useState(true);

  // Some media query here--------
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);
  useEffect(() => {
    const handleResize = () => {
      const smallScreen = window.innerWidth < 600;
      setIsSmallScreen(smallScreen);

      // Show chats if screen size is larger than 600px
      if (!smallScreen) {
        setIsChatsVisible(true);
      }
    };

    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Cleanup listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // -----------------------------

  useEffect(() =>{
    const fetchConvos = async () =>{
      try{
        const convosResponse = await fetchConversations(loggedInUserId);
        setConversations(convosResponse);
        setLoadingConvos(false);
        console.log("this is convos response: ", convosResponse);
      }catch(error){
        console.error('Error fetching the conversations:', error);
      }
    }

    fetchConvos();
  }, []);

  // Fetch conversation by ID if conversationId is present
  useEffect(() => {
    const fetchSingleConversation = async () => {
      if (conversationId) {
        try {
          const conversation = await fetchConversationById(conversationId);
          setSelectedConversation(conversation);
        } catch (error) {
          console.error('Error fetching the conversation:', error);
        }
      } else {
        setSelectedConversation(null); // Clear the selected conversation when no ID
      }
    };

    fetchSingleConversation();
  }, [conversationId]);


  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    navigate(`/messages/${conversation._id}`);
  };

  const toggleChatsVisibility = () => {
    setIsChatsVisible((prevState) => !prevState);
  };

  const handleConvoClick = (conversation) => {
    handleSelectConversation(conversation);
    if(isSmallScreen){
      setIsChatsVisible(false);
    }
  };

  return (
    <div className='messages-page'>
      <ScrollToTop/>
      <NavBar/>
      <div className={`chats ${isChatsVisible ? 'visible' : 'hidden'}`}>
        <div className='chats-top'>
          <h2>Chats</h2>
        </div>
        <div className='chats-list'>
          {loadingConvos ? (
            <div className='spinner-box'>
              <div className='spinner'></div>
            </div>
          ) : conversations.length === 0 ? (
            <div className='spinner-box'>
              <p>No conversations yet</p>
            </div>
          ) : (
            conversations.map((conversation, index) => {
              const otherParticipant = 
                conversation.participants[0]._id === loggedInUserId
                  ? conversation.participants[1]
                  : conversation.participants[0];

              const lastMessageText = conversation.lastMessage
                ? (conversation.lastMessage.senderId === loggedInUserId
                    ? "You: " + conversation.lastMessage.content
                    : otherParticipant.firstName + ": " + conversation.lastMessage.content)
                : "No messages yet";

              return (
                <React.Fragment key={conversation._id}>
                  <ConvoContainer
                    name={otherParticipant.firstName + " " + otherParticipant.lastName}
                    ppKey={otherParticipant.profilePictureKey}
                    lastMessage={lastMessageText}
                    isSelected={selectedConversation?._id === conversation._id}
                    onClick={() => handleConvoClick(conversation)}
                  />
                  {index < conversations.length - 1 && <div className="chats-divider" />}
                </React.Fragment>
              );
            })
          )}
        </div>
      </div>
      <div className='chat'>
        <button className="toggle-chats-btn" onClick={toggleChatsVisibility}>
          {isChatsVisible ? 'Close Chats' : 'Open Chats'}
        </button>
        {selectedConversation ? (
          <ChatBox key={selectedConversation._id} conversation={selectedConversation} />
          // Key here recreates a new ChatBox component everytime conversation changes.
        ) : (
          <h1>Select a conversation to view messages!</h1>
        )}
      </div>
    </div>
  )
}

export default MessagesPage