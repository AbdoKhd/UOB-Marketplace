import React, {useState} from 'react'
import './SearchForm.css'
import { FaHeart } from "react-icons/fa";
import { GrLanguage } from "react-icons/gr";
import { IoIosSearch } from "react-icons/io";

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Components/AuthContext';

const SearchForm = ({urlSearchQuery}) => {

  const navigate = useNavigate();
  const {loggedInUserId} = useAuth();

  const [searchQuery, setSearchQuery] = useState(urlSearchQuery || "");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/listings/search/${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleGoToFavorites = () =>{
    navigate('/otherListings', {
      state: {
        pageTitle: 'My Favorites',
        userId: loggedInUserId,
      },
    })
  }

  return (
    <div className='search-form'>
      <div className='search-form-left'>
        <input
          type="text"
          placeholder="Search for laptops, books, notes, previous exams, clothes ..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="search-btn" onClick={handleSearch}>
          <IoIosSearch className="search-icon" />
        </button>
        
      </div>
      <div className='search-form-right'>
        <FaHeart className='icon' onClick={handleGoToFavorites}/>
        <GrLanguage className='icon'/>
      </div>
    </div>
  )
}

export default SearchForm

