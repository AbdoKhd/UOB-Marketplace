import React, {useState, useRef} from 'react'
import NavBar from '../../Components/NavBar/NavBar'
import './SellPage.css'
import http from '../../http-common';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Components/AuthContext';

import ScrollToTop from '../../Components/ScrollToTop/ScrollToTop';

const SellPage = () => {

  const { user } = useAuth();

  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const titleMaxChars = 80;
  const [titleError, setTitleError] = useState(false);

  const [category, setCategory] = useState("");
  const [categoryError, setCategoryError] = useState(false);

  const [description, setDescription] = useState("");

  const [price, setPrice] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [priceError, setPriceError] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [postingInProgress, setPostingInProgress] = useState(false);

  function selectFiles(){
    fileInputRef.current.click();
  }

  function onFileSelect(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
  
    const validImages = [];
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.split('/')[0] === 'image' && !images.some((e) => e.name === files[i].name)) {
        validImages.push(files[i]);
      }
    }
  
    if (validImages.length > 0) {
      setImages((prevImages) => [...prevImages, ...validImages]);
    }
  
    // Reset the file input's value to allow re-selection of the same file
    event.target.value = null;
  }

  function deleteImage(index){
    setImages((prevImages) => 
      prevImages.filter((_,i) => i !== index)
    );
  }

  function onDragOver(event){
    event.preventDefault();
    setIsDragging(true);
    event.dataTransfer.dropEffect = "copy";
  }

  function onDragLeave(event){
    event.preventDefault();
    setIsDragging(false);
  }

  function onDrop(event){
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;

    for(let i = 0; i < files.length; i++){
      if(files[i].type.split('/')[0] !== 'image') continue;
      if(!images.some((e) => e.name === files[i].name)){
        console.log(files[i]);
        setImages((prevImages) => [
          ...prevImages,
          files[i]
        ]);
      }
    }
  }

  function handleTitleChange(event){
    const value = event.target.value;

    if(value.length <= titleMaxChars){
      setTitle(value);
      setTitleError(false);
    }
  }

  function handleCategoryChange(event){
    setCategory(event.target.value);
    setCategoryError(false);
  }

  function handleDescriptionChange(event) {
    setDescription(event.target.value);
  }

  function handlePriceChange(event) {
    const value = event.target.value;
    if (!isNaN(value) && value >= 0) {
      setPrice(value);
      setPriceError(false);
    }
  }

  function handleFreeChange() {
    setIsFree((prevIsFree) => !prevIsFree);
    if (!isFree) {
      setPrice("");
      setPriceError(false);
    }
  }

  //Post button
  const handleButtonClick = async (e) => {
    if(!title || !category || (!price && !isFree)){
      setErrorMessage("Check required fields");

      if (!title) setTitleError(true);
      if (!category) setCategoryError(true);
      if (!price && !isFree) setPriceError(true);
    }
    else{
      // Post Listing
      try {
        setPostingInProgress(true);
        setErrorMessage("");
        console.log('Images before upload:', images);

        let imagesKey = []
        if(images.length !== 0){
        
          // Prepare FormData
          const formData = new FormData();
          images.forEach((file) => {
            formData.append('images', file); // Append each file
          });

          // Send POST request with FormData
          const imageResponse = await http.post('/api/images/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          imagesKey = imageResponse.data.imageKeys;
          console.log(imagesKey);

        }


        // Make a POST request to the backend's listings route
        const response = await http.post('/api/listings/postListing', {
          imagesKey: imagesKey,
          title: title,
          category: category,
          description: description,
          price: price,
          user: user.id
        });

        console.log("this is the id of the posted listing: ", response.data.newListing._id);

        const addListingToUserMyListings = await http.post(`/api/users/addListingToUser/myListings/${user.id}`, {
          listingId: response.data.newListing._id
        });
  
        if(response.status === 200){
          setPostingInProgress(false);
          navigate('/listings', { state: { notification: 'Listing posted successfully!' } });
        }
  
      } catch (error) {
        // Handle any errors
        setPostingInProgress(false);
        console.error('There was an error posting the listing!', error);
        setErrorMessage("Posting the listing has failed. Please try again.");
      }
    }
  }

  return (
    <div className='sell-page'>
      <ScrollToTop/>
      <NavBar/>
      <h2>Complete your listing</h2>
      <div className='listing-container'>
        <h3>Photos</h3>
        <div className='drag-area' onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
          {isDragging ? (
            <span className='select'>
              Drop images here
            </span>
          ):(
            <>
            Drag and Drop image here or {" "}
            <span className='select' role="button" onClick={selectFiles}>
              Browse
            </span>
            </>
          )}
          <input name='file' type='file' className='file' multiple ref={fileInputRef} onChange={onFileSelect} accept="image/jpeg, image/png"></input>
        </div>
        <div className='images-container'>
          {images.map((images, index) => (
            <div className='image' key={index}>
              <span className='delete' onClick={() => deleteImage(index)}>&times;</span>
              <img src={URL.createObjectURL(images)} alt={images.name} />
            </div>
          ))}
        </div>
      </div>
      <div className='listing-container'>
        <h3>Title *</h3>
        <h4>Item title</h4>
        <input type="text" placeholder="Title" className={`title-input ${titleError ? 'error' : ''}`} value={title} onChange={handleTitleChange} maxLength={titleMaxChars}></input>
        <div className='char-counter'>{title.length}/{titleMaxChars}</div>
      </div>
      <div className='listing-container'>
        <h3>Category *</h3>
        <h4>Choose the category that your item belongs to</h4>
        <select className={`category-select ${categoryError ? 'error' : ''}`} value={category} onChange={handleCategoryChange}>
          <option value="">Select a category</option>
          <option value="Electronics">Electronics</option>
          <option value="University tools">University tools</option>
          <option value="Clothes">Clothes</option>
          <option value="Directions">Directions</option>
          <option value="Tutoring">Tutoring</option>
          <option value="Events">Events</option>
        </select>
      </div>
      <div className='listing-container'>
        <h3>Description</h3>
        <h4>Describe the item</h4>
        <textarea 
          placeholder="Enter a detailed description of your item here..." 
          className='description-textarea' 
          value={description} 
          onChange={handleDescriptionChange} 
          rows="5"
        ></textarea>
      </div>
      <div className='listing-container'>
        <h3>Pricing *</h3>
        <h4>Enter the price of the item</h4>
        <div className='price-section'>
          <div className='price-input-wrapper'>
            <input 
              type="number"
              className={`price-input ${priceError ? 'error' : ''}`}
              value={price} 
              onChange={handlePriceChange} 
              disabled={isFree} 
            />
          </div>
          <label>
            <input 
              className='isfree-checkbox'
              type="checkbox" 
              checked={isFree} 
              onChange={handleFreeChange} 
            /> 
            Free
          </label>
        </div>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {postingInProgress && <div className='spinner'></div>}

      <button className='post-button' onClick={handleButtonClick} disabled={postingInProgress}>Post Item</button>
    </div>
  )
}

export default SellPage