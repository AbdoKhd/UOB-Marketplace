import http from '../http-common';

export const fetchConversations = async (userId) => {
  try {
    const response = await http.post(`/api/messaging/getConversations/${userId}`)
    return response.data;
  } catch (error) {
    // console.error('Error fetching conversations:', error);
    throw error;
  }
};

export const fetchConversationById = async (conversationId, userId) => {
  try {
    // console.log("sending this userId: ", userId);
    const response = await http.get(`/api/messaging/getConversationById/${conversationId}?userId=${userId}`);
    return response.data;
  } catch (error) {
    // console.error('Error fetching conversation by ID:', error);
    throw error;
  }
};

export const createConversation = async (senderId, receiverId) => {
  try {
    const response = await http.post(`/api/messaging/createConversation`, {
      senderId: senderId,
      receiverId: receiverId
    })
    return response.data;
  } catch (error) {
    // console.error('Error creating the conversation:', error);
    throw error;
  }
};

export const fetchMessages = async (conversationId) => {
  try {
    const response = await http.post(`/api/messaging/getMessages/${conversationId}`)
    return response.data;
  } catch (error) {
    // console.error('Error fetching messages:', error);
    throw error;
  }
};

export const sendMessage = async (senderId, receiverId, conversationId, content) => {
  try {
    const response = await http.post(`/api/messaging/sendMessage/${conversationId}`, {
      senderId: senderId,
      receiverId: receiverId,
      content: content
    });
    return response.data;
  } catch (error) {
    // console.error('Error sending message:', error);
    throw error;
  }
};