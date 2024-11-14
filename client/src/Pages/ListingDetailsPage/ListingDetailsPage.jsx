import React, { useState, useEffect } from 'react';
import './ListingDetailsPage.css'
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import pic from '../../Assets/ps5.jpg'
import NavBar from '../../Components/NavBar/NavBar'
import http from '../../http-common';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ListingDetailsPage = () => {

  const navigate = useNavigate();
  const {listingId}  = useParams();
  const [listing, setListing] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "black" }}
        onClick={onClick}
      />
    );
  }
  
  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "black" }}
        onClick={onClick}
      />
    );
  }

  useEffect(() => {
    // Fetch listing
    const fetchListing = async () => {
      try {
        const response = await http.get(`/api/listings/getListing/${listingId}`);
        const fetchedListing = response.data.listing;
        setListing(response.data.listing);

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
      <div className='listing-details-page'>
        <NavBar/>
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
    nextArrow: <SampleNextArrow className='right-arrow'/>,
    prevArrow: <SamplePrevArrow />,
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
    </div>
  )
}

export default ListingDetailsPage