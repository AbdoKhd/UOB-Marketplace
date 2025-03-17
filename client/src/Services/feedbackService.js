import http from '../http-common';

export const submitFeedback = async (stars, title, comment, userId) => {
  try {
    console.log("this is stars: ", stars);
    console.log("this is title: ", title);
    console.log("this is comment: ", comment);
    console.log("this is userId: ", userId);
    const response = await http.post('/api/feedback/submitFeedback', {
      stars: stars,
      title: title,
      comment: comment,
      userId: userId
    });
    return response;
  } catch (error) {
    return error.response;
  }
};