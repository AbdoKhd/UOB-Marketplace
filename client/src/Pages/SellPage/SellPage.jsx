import React, {useState, useRef} from 'react'
import NavBar from '../../Components/NavBar/NavBar'
import './SellPage.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Components/AuthContext';

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

  function selectFiles(){
    fileInputRef.current.click();
  }

  function onFileSelect(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
  
    const validImages = [];
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.split('/')[0] === 'image' && !images.some((e) => e.name === files[i].name)) {
        validImages.push({
          name: files[i].name,
          url: URL.createObjectURL(files[i]),
        });
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
        setImages((prevImages) => [
          ...prevImages,
          {
            name: files[i].name,
            url: URL.createObjectURL(files[i]),
          },
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
        // Make a POST request to the backend's register route
        const response = await axios.post('http://localhost:5000/api/listings/postListing', {
          title: title,
          category: category,
          description: description,
          price: price,
          user: user.id
        });
  
        if(response.status === 200){
          console.log('Listing posted successfully');
          navigate('/listings');
        }
  
  
      } catch (error) {
        // Handle any errors
        console.error('There was an error posting the listing!', error);
        setErrorMessage("Posting the listing has failed. Please try again.");
      }
    }
  }

  return (
    <div className='sell-page'>
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
              <img src={images.url} alt={images.name} />
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

      <button className='post-button' onClick={handleButtonClick}>Post Item</button>
    </div>
  )
}

export default SellPage