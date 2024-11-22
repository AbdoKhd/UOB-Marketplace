import React, { useState, useEffect } from 'react';
import Listing from '../Listing/Listing'
import './ListingsGrid.css'
import { getImages } from '../../Services/imageService';

const ListingsGrid = ({listings, myFavorites}) => {

  const [firstImages, setFirstImages] = useState([]);

  useEffect(() => {

    // Fetching the first image of each listing
    const fetchFirstImages = async () => {
      try {
        const imagePromises = listings.map( async (listing) =>{
          if (listing.imagesKey && listing.imagesKey.length > 0) {
            const firstImageResponse = await getImages(listing.imagesKey[0]);
            return firstImageResponse.images[0];
          } else {
            return null; // Handle listings with no images
          }
        });

        // Wait for all promises to resolve and set the first images
        const resolvedImages = await Promise.all(imagePromises);
        setFirstImages(resolvedImages);

      } catch (error) {
        console.error('Error fetching first image of the listings:', error);
      }
    };

    fetchFirstImages();
  }, [listings, myFavorites]);

  return (
    <div className='listings-grid'>
      {listings.map((listing, index) => (
        <Listing
          key={listing._id}
          listingId={listing._id}
          title={listing.title}
          price={listing.price}
          image={firstImages[index]}
          isInFavorites={myFavorites.includes(listing._id)}
        />
      ))}
    </div>
  )
}

export default ListingsGrid