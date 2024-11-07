import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Listing from '../Listing/Listing'
import './ListingsMatrix.css'

const ListingsMatrix = () => {

  const [listings, setListings] = useState([]);

  useEffect(() => {
    // Fetch listings from your backend
    const fetchListings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/listings/getListings');
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
          key={listing._id} // Use unique ID from the database
          listingId={listing.id}
          title={listing.title}
          category={listing.category}
          description={listing.description}
          price={listing.price}
        />
      ))}
    </div>
  )
}

export default ListingsMatrix