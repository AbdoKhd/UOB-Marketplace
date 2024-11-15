import React, { useState, useEffect } from 'react';
import './ListingDetailsPage.css'
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import pic from '../../Assets/ps5.jpg'
import NavBar from '../../Components/NavBar/NavBar'
import http from '../../http-common';
import { useAuth } from '../../Components/AuthContext';

// Spinner
import {FaSpinner} from "react-icons/fa";

// Slider
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import ScrollToTop from '../../Components/ScrollToTop/ScrollToTop';

const ListingDetailsPage = () => {

  const { user } = useAuth();
  const navigate = useNavigate();
  const {listingId}  = useParams();
  const [listing, setListing] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listingUserId, setListingUserId] = useState();

  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const [isLiked, setIsLiked] = useState(false);
  const [editingFavorites, setEditingFavorites] = useState(false);

  const confirmDelete = () => {
    handleDeleteListing();
  };

  const cancelDelete = () => {
    setShowDeletePopup(false);
  };

  const showDeletePopupFun = () => {
    setShowDeletePopup(true);
  };

  const handleBtnFavorite = async (event) =>{
    try{
      if(!isLiked){
        // Add to favorites
        setEditingFavorites(true);
        const addListingToUserFavorites = await http.post(`/api/users/addListingToUser/myFavorites/${user.id}`, {
          listingId: listingId
        });
        setEditingFavorites(false);
        setIsLiked(true);
      }
      else{
        // Remove from favorites
        setEditingFavorites(true);
        const removeListingFromUserFavorites = await http.post(`/api/users/removeListingFromUser/myFavorites/${user.id}`, {
          listingId: listingId
        });
        setEditingFavorites(false);
        setIsLiked(false);
      }
    }catch(error){
      console.error("Error updating favorites:", error);
    }
  }

  // Delete the listing
  const handleDeleteListing = async (event) =>{
    try{
      /* IMPORTANT !!!
        Make sure to delete the listing from the user's favorites if it is in the favorites
      */
      const deleteListingResponse = await http.post(`/api/listings/deleteListing/${listingId}`);

      navigate('/listings', { state: { notification: 'Listing deleted successfully!' } });

    }catch(error){
      console.error("Error deleting listing:", error);
    }
  }

  useEffect(() => {

    // Fetch user's favorites
    const fetchUserFavorites = async () => {
      try {
        const favoritesResponse = await http.get(`/api/users/getUserFavorites/${user.id}`)

        if(favoritesResponse.data.favorites.includes(listingId)){
          setIsLiked(true);
        }

      } catch (error) {
        console.error('Error fetching the user favorites:', error);
      }
    };
  
    // Fetch listing
    const fetchListing = async () => {
      try {
        const response = await http.get(`/api/listings/getListing/${listingId}`);
        const fetchedListing = response.data.listing;
        setListing(response.data.listing);

        //console.log("this listing is posted by: ", response.data.listing.user);
        setListingUserId(response.data.listing.user._id);

        if (fetchedListing.imagesKey && fetchedListing.imagesKey.length > 0) {
          const imageResponse = await http.post('/api/images/getImages', {
            imagesKey: fetchedListing.imagesKey,
          });
          setImages(imageResponse.data.images);
        }

        setLoading(false);

      } catch (error) {
        console.error('Error fetching listing or images:', error);
        setLoading(false);
      }
    };

    fetchUserFavorites();
    fetchListing();
  }, [listingId]);

  // Handle loading and null checks
  if (loading) {
    return (
      <div>
        <NavBar/>
        <div className='spinner-wrapper'>
          <div className='spinner'></div>
        </div>
      </div>
    )  
  }

  if (!listing) {
    return (
      <div>
        <NavBar/>
        <div className='spinner-wrapper'>
          <p>Listing not found</p>;
        </div>
      </div>
    )
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className='listing-details-page'>
      <ScrollToTop/>
      <NavBar/>
      <div className='top'>
        <div className='slider-container'>
          {images && images.length > 0 ? (
            images.length > 1 ? (
              <Slider className='my-slider' {...settings}>
                {images.map((image, index) => (
                  <div key={index}>
                    <img src={image.content} alt='' />
                  </div>
                ))}
              </Slider>
            ) : (
              // Directly render a single image without using the slider
              <div className='one-image-container'>
                <img src={images[0].content} alt='' />
              </div>
            )
          ) : (
            <p className='no-images-container'>No images available</p>
          )}
        </div>
        <div className='listing-info'>
          <h2>{listing.title}</h2>
          <div className='divider'></div>
          <p><strong>Category:</strong> {listing.category}</p>
          <div className='divider'></div>
          <p><strong>Description:</strong> {listing.description}</p>
          <div className='divider'></div>
          <p><strong>Price:</strong> ${listing.price}</p>
        </div>
      </div>
      <div className='other'>
        {listingUserId === user.id ? (
          <div className='my-listing'>
            {editingFavorites ?
            <FaSpinner className='icon spinner-favorite' />
            : isLiked ? 
              <button className='add-to-favorites-btn' onClick={handleBtnFavorite}>
                Remove from favorites
              </button>
            : <button className='add-to-favorites-btn' onClick={handleBtnFavorite}>Add to favorites</button>}
            <button className='delete-btn' onClick={showDeletePopupFun}>Delete listing</button>
          </div>
        ):(
          <div className='not-my-listing'>
            <p>User info here</p>
          </div>
        )}
      </div>

      {showDeletePopup && (
      <>
        <div className='overlay'></div>
        <div className='logout-popup'>
          <p>Are you sure you want to delete this listing?</p>
          <div className='buttons'>
            <button onClick={confirmDelete}>Yes</button>
            <button onClick={cancelDelete}>No</button>
          </div>
        </div>
      </>
      )}
    </div>
  )
}

export default ListingDetailsPage