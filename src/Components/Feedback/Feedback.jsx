import { useState } from "react";
import './Feedback.css'
import { submitFeedback } from "../../Services/feedbackService";
import { useAuth } from '../../Components/AuthContext';

const Feedback = ({ isOpen, onClose }) => {

  const { loggedInUserId } = useAuth();

  const [feedback, setFeedback] = useState("");
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [stars, setStars] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false); // For loading

  if (!isOpen) return null; // Don't render if modal is closed

  // Function to handle star selection
  const handleStarClick = (index) => {
    setStars(index + 1); // Set stars based on index (1-based)
  };

  // Function to render stars
  const renderStars = () => {
    let starElements = [];
    for (let i = 0; i < 5; i++) {
      starElements.push(
        <span
          key={i}
          className={`star ${i < stars ? "filled" : ""}`}
          onClick={() => handleStarClick(i)}
        >
          &#9733;
        </span>
      );
    }
    return starElements;
  };

  const handleSubmitFeedback = async () => {
    console.log("stars:", stars);
    console.log("title:", feedbackTitle);
    console.log("Feedback:", feedback);
    setErrorMessage("");

    if(stars === 0){
      setErrorMessage("At least one star :(");
      return;
    }
    
    try{
      setSubmitting(true);
      const submitFeedbackResponse = await submitFeedback(stars, feedbackTitle, feedback, loggedInUserId);

      if(submitFeedbackResponse.status == 200){
        alert("Feedback submitted!");
        onClose();// Close modal after submitting
        setFeedback("");
        setFeedbackTitle("");
        setStars(0);
      }
      else{
        setErrorMessage(submitFeedbackResponse.data.message);
      }

    }catch(error){
      setErrorMessage("An error occurred");
    }
    finally{
      setSubmitting(false);
    }
  };

  return (
    // Modal Overlay (Dark Background)
    <div className="feedback-overlay">
      <div className="feedback-modal">
        
        <h2>Give Us Your Feedback</h2>

        <div className="stars">{renderStars()}</div>

        <input
          className="feedback-textarea-title"
          placeholder="Feedback title..."
          value={feedbackTitle}
          onChange={(e) => setFeedbackTitle(e.target.value)}
          maxLength={50}
        />
        <textarea
          className="feedback-textarea"
          rows="4"
          placeholder="Write your feedback here..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          maxLength={300}
        />

        {errorMessage && <p className="feedback-error-message">{errorMessage}</p>}

        {submitting ? (
          <div className="loader"></div>
        ) : (
          <div className="feedback-buttons">
          
            <button className="feedback-cancel" onClick={onClose}>
              Cancel
            </button>
            
            <button
              className="feedback-submit"
              onClick={() => {
                handleSubmitFeedback();
              }}
            >
              Submit
            </button>
          </div>
        )}
        
        
      </div>
    </div>
  );
};

export default Feedback;
