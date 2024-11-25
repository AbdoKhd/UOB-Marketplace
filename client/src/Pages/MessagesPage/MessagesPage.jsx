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

  useEffect(() =>{
    const fetchConvos = async () =>{
      try{
        const convosResponse = await fetchConversations(loggedInUserId);
        setConversations(convosResponse);
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
        console.log("this is convo id: ", conversationId);
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

  return (
    <div className='messages-page'>
      <ScrollToTop/>
      <NavBar/>
      <div className='chats'>
        <div className='chats-top'>
          <h2>Chats</h2>
        </div>
        <div className='chats-list'>
          {conversations.map((conversation, index) => {
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
              <React.Fragment key={conversation.id}>
                <ConvoContainer
                  name={otherParticipant.firstName + " " + otherParticipant.lastName}
                  lastMessage={ lastMessageText }
                  isSelected={selectedConversation?._id === conversation._id}
                  onClick={() => handleSelectConversation(conversation)}
                />
                {index < conversations.length - 1 && <div className="chats-divider" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      <div className='chat'>
        {selectedConversation ? 
        <ChatBox conversation={selectedConversation}/>: 
        <h1>
          Select a conversation to view messages!
        </h1>}
        
      </div>
    </div>
  )
}

export default MessagesPage