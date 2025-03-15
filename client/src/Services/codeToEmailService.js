import http from '../http-common';

export const sendResetCode = async (email) => {
  try {
    const response = await http.post('/api/codeToEmail/send-reset-code', {
      email,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const verifyResetCode = async (email, code) => {
  try {
    const response = await http.post('/api/codeToEmail/verify-reset-code', {
      email,
      code,
    });
    return response;
  } catch (error) {
    return error.response;
  }
};


// Registration code
export const sendRegistrationCode = async (email) => {
  try {
    const response = await http.post('/api/codeToEmail/send-registration-code', {
      email,
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const verifyRegistrationCode = async (email, code) => {
  try {
    const response = await http.post('/api/codeToEmail/verify-registration-code', {
      email,
      code,
    });
    return response;
  } catch (error) {
    return error.response;
  }
};