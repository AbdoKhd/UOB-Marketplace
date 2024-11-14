import React, { useState, useEffect } from 'react';
import http from '../../http-common';
import Listing from '../Listing/Listing'
import './ListingsMatrix.css'
import { useAuth } from '../../Components/AuthContext';

const ListingsMatrix = () => {

  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [firstImages, setFirstImages] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);

  useEffect(() => {

    //Fetch user's favorites
    const fetchUserFavorites = async () => {
      try {
        const favoritesResponse = await http.get(`/api/users/getUserFavorites/${user.id}`)
        setUserFavorites(favoritesResponse.data.favorites);

      } catch (error) {
        console.error('Error fetching the user favorites:', error);
      }
    };

    // Fetch listings from your backend
    const fetchListings = async () => {
      try {
        const response = await http.get('/api/listings/getListings');
        const listingsArray = response.data;
        setListings(listingsArray);

        //fetching the first image of each listing
        const imagePromises = listingsArray.map( async (listing) =>{
          if (listing.imagesKey && listing.imagesKey.length > 0) {
            const firstImageResponse = await http.post('/api/images/getImages', {
              imagesKey: listing.imagesKey[0],
            });
            return firstImageResponse.data.images[0];
          } else {
            return null; // Handle listings with no images
          }
        });

        // Wait for all promises to resolve and set the first images
        const resolvedImages = await Promise.all(imagePromises);
        setFirstImages(resolvedImages);

      } catch (error) {
        console.error('Error fetching listings or first image of the listings:', error);
      }
    };

    fetchUserFavorites();
    fetchListings();
  }, []);

  return (
    <div className='listings-matrix'>
      {listings.map((listing, index) => (
        <Listing
          key={listing._id}
          listingId={listing._id}
          title={listing.title}
          price={listing.price}
          image={firstImages[index]}
          isInFavorites={userFavorites.includes(listing._id)}
        />
      ))}
    </div>
  )
}

export default ListingsMatrix