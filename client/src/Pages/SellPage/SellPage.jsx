import React, {useState, useRef} from 'react'
import NavBar from '../../Components/NavBar/NavBar'
import './SellPage.css'

const SellPage = () => {

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


  function handleButtonClick() {
    if(!title || !category || (!price && !isFree)){
      alert("Check required");

      if (!title) setTitleError(true);
      if (!category) setCategoryError(true);
      if (!price && !isFree) setPriceError(true);
    }
    else{
      // Proceed with form submission or further validation
      console.log("These are the images: ", images);
      console.log("This is the title: ", title);
      console.log("This is the category: ", category);
      console.log("This is the description: ", description);
      console.log("This is the price: ", price);
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
      <button className='post-button' onClick={handleButtonClick}>Post Item</button>
    </div>
  )
}

export default SellPage