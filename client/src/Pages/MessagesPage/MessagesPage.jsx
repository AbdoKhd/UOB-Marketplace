import React from 'react'
import {useState, useEffect, useRef} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import './MessagesPage.css'
import { useAuth } from '../../Components/AuthContext';
import { useSocket } from '../../socketContext'

import { fetchConversations, fetchConversationById } from '../../Services/messagingService';

import NavBar from '../../Components/NavBar/NavBar';
import ScrollToTop from '../../Components/ScrollToTop/ScrollToTop';

import ConvoContainer from '../../Components/ConvoContainer/ConvoContainer';
import ChatBox from '../../Components/ChatBox/ChatBox';

const MessagesPage = () => {
  const { conversationId } = useParams();
  const convoIdRef = useRef(conversationId);
  const navigate = useNavigate();

  const socket = useSocket();

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

  useEffect(() => {
    if (!socket) return;

    // Preserve existing queries and add loggedInUserId
    socket.io.opts.query = { ...socket.io.opts.query, loggedInUserId };
    socket.connect();

    socket.emit("joinPersonalRoom", loggedInUserId); //the personal room id will be the user's id
    console.log("joined personal room");

    socket.on("directMessage", (message) => {
      console.log("New message in MessagesPage:", message);

      setConversations((prevConversations) => {
        const existingIndex = prevConversations.findIndex(
          (conv) => conv._id === message.conversationId
        );
  
        if (existingIndex !== -1) {
          // Move the conversation to the top
          const updatedConvos = [...prevConversations];
          const [movedConvo] = updatedConvos.splice(existingIndex, 1); // Remove the existing convo
          movedConvo.lastMessage = message; // Update the last message
          if(message.senderId !== loggedInUserId && message.status !== 'seen'){
            movedConvo.unreadCount = movedConvo.unreadCount + 1;
          }
          updatedConvos.unshift(movedConvo); // Add it to the top
  
          return [...updatedConvos];
        } else {
          // If conversation doesn't exist, fetch it and update the lastMessage
          fetchConversations(loggedInUserId).then((newConvos) => {
            //console.log("Convo does not exist, fetching conversations:", newConvos);

            // Find the conversation and update lastMessage before setting state
            const updatedConvos = newConvos.map((conv) => 
              conv._id === message.conversationId ? { ...conv, lastMessage: message } : conv
            );

            setConversations(updatedConvos);
          });

          return prevConversations;
        }
      });
    });

    const handleConvoLastMessageStatusUpdate = ({ conversationId, status }) => {
      // console.log("in handleConvoLastMessageStatusUpdate status: ", status);
      // console.log("in handleConvoLastMessageStatusUpdate conversationId: ", conversationId);
      setConversations((prevConversations) => 
        prevConversations.map((conversation) =>
          conversation._id === conversationId
            ? {
                ...conversation,
                lastMessage: {
                  ...conversation.lastMessage,
                  status: status, // Update the status
                },
                unreadCount: 0,
              }
            : conversation
        )
      );
    };
    socket.on("convoLastMessageStatusUpdate", handleConvoLastMessageStatusUpdate);

    const handleFetchConvosAgain = async () => {
      console.log("fetching convos again");
      try{
        const convosResponse = await fetchConversations(loggedInUserId);
        setConversations(convosResponse);
        setLoadingConvos(false);
        console.log("this is convos again response: ", convosResponse);
      }catch(error){
        console.error('Error fetching the conversations again:', error);
      }
    };
    socket.on("fetchConvosAgain", handleFetchConvosAgain);

    return () => {
      if(socket){
        socket.off("directMessage");
        socket.off("fetchConvosAgain", handleFetchConvosAgain);

        if(convoIdRef.current){
          socket.emit("leaveRoom", { roomId: convoIdRef.current, userId: loggedInUserId });
          console.log("left convo room!");
        }

        socket.emit("leavePersonalRoom", loggedInUserId);
        console.log("left personal room");
        

        // socket.once("leavePersonalRoom", () => {
        //   socket.disconnect();
        // });
        
      }
    };
  }, [socket, loggedInUserId]);

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
    convoIdRef.current = conversationId;
    const fetchSingleConversation = async () => {
      if(!conversationId && selectedConversation){
        console.log("left convo room!");
        socket.emit('leaveRoom', {roomId: selectedConversation._id, userId: loggedInUserId}); // leave room
      }
      if (conversationId) {
        try {

          // selectedConversation here is the previously selected convo not the one just clicked
          if(selectedConversation){
            console.log("left convo room!");
            socket.emit('leaveRoom', {roomId: selectedConversation._id, userId: loggedInUserId}); // leave room
          }

          const conversation = await fetchConversationById(conversationId);
          setSelectedConversation(conversation);

          const roomId = conversationId;

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
    if(conversationId !== conversation._id){
      navigate(`/messages/${conversation._id}`);
    }
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
                    lastMessageObj={conversation.lastMessage}
                    unreadCount={conversation.unreadCount}
                    isSelected={conversationId === conversation._id}
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