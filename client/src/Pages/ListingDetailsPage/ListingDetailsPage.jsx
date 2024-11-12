import React, { useState, useEffect } from 'react';
import './ListingDetailsPage.css'
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import pic from '../../Assets/ps5.jpg'
import NavBar from '../../Components/NavBar/NavBar'
import http from '../../http-common';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Slider from 'react-slick';

const ListingDetailsPage = () => {

  const navigate = useNavigate();
  const {listingId}  = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dummy data for testing the slider
  const dummyImages = [
    pic,
    'https://via.placeholder.com/800x400?text=Image+2',
    'https://via.placeholder.com/800x400?text=Image+3',
    'https://via.placeholder.com/800x400?text=Image+4',
  ];

  useEffect(() => {
    // Fetch listing
    const fetchListing = async () => {
      try {
        const response = await http.get(`/api/listings/getListing/${listingId}`);
        setListing(response.data.listing);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching listing:', error);
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  // Handle loading and null checks
  if (loading) {
    return (
      <div className='listing-details-page'>
        <p>Loading...</p>;
      </div>
    )
        
  }

  if (!listing) {
    return (
      <div className='listing-details-page'>
        <p>Listing not found</p>;
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
      <NavBar/>
      <div className='top'>
        <div className='listing-image'>
          {dummyImages && dummyImages.length > 0 ? (
            <Slider {...settings}>
              {dummyImages.map((image, index) => (
                <div key={index}>
                  <img src={image} alt={`Listing Image ${index + 1}`} />
                </div>
              ))}
            </Slider>
          ) : (
            <p>No images available</p>
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
    </div>
  )
}

export default ListingDetailsPage