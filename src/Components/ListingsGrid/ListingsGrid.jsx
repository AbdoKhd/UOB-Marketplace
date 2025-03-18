import React, { useState, useEffect } from 'react';
import Listing from '../Listing/Listing'
import './ListingsGrid.css'
import { getImages } from '../../Services/imageService';

const ListingsGrid = ({listings, myFavorites}) => {

  return (
    <div className='listings-grid'>
      {listings.map((listing, index) => (
        <Listing
          key={listing._id}
          listingId={listing._id}
          title={listing.title}
          price={listing.price}
          imageKey={listing.imagesKey ? listing.imagesKey[0] : null}
          isInFavorites={myFavorites.includes(listing._id)}
          userId={listing.user._id}
        />
      ))}
    </div>
  )
}

export default ListingsGrid