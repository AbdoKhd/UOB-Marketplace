import React, { useState, useEffect } from 'react';
import http from '../../http-common';
import Listing from '../Listing/Listing'
import './ListingsMatrix.css'

const ListingsMatrix = () => {

  const [listings, setListings] = useState([]);

  useEffect(() => {
    // Fetch listings from your backend
    const fetchListings = async () => {
      try {
        const response = await http.get('/api/listings/getListings');
        setListings(response.data);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className='listings-matrix'>
      {listings.map((listing) => (
        <Listing
          key={listing._id}
          listingId={listing._id}
          title={listing.title}
          price={listing.price}
        />
      ))}
    </div>
  )
}

export default ListingsMatrix