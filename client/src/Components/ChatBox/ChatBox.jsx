import React, { useState, useEffect, useRef } from 'react';
import './ChatBox.css'
import socket from "../../socket";


import { useAuth } from '../../Components/AuthContext';
import { fetchMessages, sendMessage } from '../../Services/messagingService';

const ChatBox = (conversation) => {

  const convo = conversation.conversation;

  console.log("this is the convo id in chatBox: ", convo._id);

  const { loggedInUserId } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const otherParticipantId = convo.participants[0]._id === loggedInUserId ? convo.participants[1]._id : convo.participants[0]._id;

  // Fetch messages when the conversation changes
  useEffect(() => {
    if (convo) {
      socket.connect();

      const fetchConvoMessages = async () => {
        try {
          const convoMessages = await fetchMessages(convo._id);
          console.log("these are the messages of this convo: ", convoMessages);
          setMessages(convoMessages);
        } catch (error) {
          console.error('Error fetching messages:', error);
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
      };

      // Emit the message through Socket.IO
      socket.emit("sendMessage", messageData);

      setNewMessage('');

      await sendMessage(loggedInUserId, otherParticipantId, convo._id, newMessage);

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  return (
    <div className='chat-box'>
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
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  )
}

export default ChatBox