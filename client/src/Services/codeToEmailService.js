import http from '../http-common';

export const sendResetCode = async (email) => {
  try {
    console.log("sending this email from service: ", email);
    const response = await http.post('/api/codeToEmail/send-reset-code', {
      email,
    });
    return response;
  } catch (error) {
    console.error('Error sending reset code to email:', error);
    throw error;
  }
};