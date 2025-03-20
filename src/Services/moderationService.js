import axios from 'axios';

const SIGHTENGINE_API_URL = 'https://api.sightengine.com/1.0/check.json';
const SIGHTENGINE_USER = '651079763';
const SIGHTENGINE_SECRET = 'eeTzfZVUnnTX686gjpeJaxrFnoEJMzrM';

export const moderateImage = async (image) => {
  try {
    const formData = new FormData();
    formData.append('media', image);
    formData.append('models', 'nudity-2.1,weapon,alcohol,recreational_drug,medical,offensive,text-content,gore-2.0,tobacco,violence');
    formData.append('api_user', SIGHTENGINE_USER);
    formData.append('api_secret', SIGHTENGINE_SECRET);

    const response = await axios.post(SIGHTENGINE_API_URL, formData);

    // console.log("this is response from sightEngine: ", response.data);

    const {alcohol, gore, medical, nudity, offensive, recreational_drug, tobacco, violence, weapon, error } = response.data;

    if (error) {
      // console.error('SightEngine API error:', error);
      return false;
    }
    // Log the probabilities and other relevant information
    // console.log("Alcohol Probability:", alcohol.prob);
    // console.log("Gore Probability:", gore.prob);
    // console.log("Medical Probability:", medical.prob);
    // console.log("Nudity None Probability:", nudity.none);
    // console.log("Offensive Probability:", offensive.prob);
    // console.log("Recreational Drug Probability:", recreational_drug.prob);
    // console.log("Tobacco Probability:", tobacco.prob);
    // console.log("Violence Probability:", violence.prob);
    // console.log("Weapon Firearm Probability:", weapon.classes.firearm);

    // Calculate isAppropriate after logging
    const isAppropriate =
      alcohol.prob < 0.2 &&
      gore.prob < 0.2 &&
      medical.prob < 0.2 &&
      nudity.none > 0.85 &&
      offensive.prob < 0.2 &&
      recreational_drug.prob < 0.3 &&
      tobacco.prob < 0.2 &&
      violence.prob < 0.2 &&
      weapon.classes.firearm < 0.2;
      
    return isAppropriate;
  } catch (error) {
    // console.error('Error moderating the image:', error);
    return false;
  }
};