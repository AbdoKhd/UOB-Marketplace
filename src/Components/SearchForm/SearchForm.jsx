import React, {useState, useEffect, useRef} from 'react'
import './SearchForm.css'
import { FaHeart } from "react-icons/fa";
import { GrLanguage } from "react-icons/gr";
import { IoIosSearch, IoIosArrowDown } from "react-icons/io";

import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../Components/AuthContext';

const SearchForm = ({urlSearchQuery, urlCategory, urlOrder, urlCampus}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {loggedInUserId} = useAuth();

  const [searchQuery, setSearchQuery] = useState(urlSearchQuery || "");

  const [selectedCategory, setSelectedCategory] = useState(urlCategory);

  // Helper function to calculate width based on text
  const calculateWidth = (text) => {
    const tempSpan = document.createElement("span");
    tempSpan.style.font = "16px Arial"; // Match the font style used in the dropdown
    tempSpan.style.visibility = "hidden";
    tempSpan.style.whiteSpace = "nowrap";
    tempSpan.innerText = text || "All";
    document.body.appendChild(tempSpan);
    const width = tempSpan.offsetWidth + 50; // Add padding and arrow space
    document.body.removeChild(tempSpan);
    return width;
  };

  const [dropdownWidth, setDropdownWidth] = useState(
    calculateWidth(urlCategory)
  );

  useEffect(() => {
    setDropdownWidth(calculateWidth(selectedCategory));
  }, [selectedCategory]);


  const handleSearch = () => {
    if(searchQuery === ""){
      navigate(`/listings/category/${selectedCategory}/order/${urlOrder}/campus/${urlCampus}/pgn/1`);
    }
    if (searchQuery.trim()) {
      navigate(`/listings/category/${selectedCategory}/order/${urlOrder}/campus/${urlCampus}/search/${encodeURIComponent(searchQuery)}/pgn/1`);
    }
  };

  const handleGoToFavorites = () =>{
    if(loggedInUserId){
      navigate(`/otherListings/${loggedInUserId}/Favorites`);
    }
    else{
      navigate(`/login`);
    }
  }

  return (
    <div className='search-form'>
      <div className='search-form-left'>
        <div className='dropdown-wrapper' >
          <select className='category-dropdown' style={{ width: dropdownWidth }} value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="All">All</option>
            <option value="University tools">University Tools</option>
            <option value="Tutoring">Tutoring</option>
            <option value="Electronics">Electronics</option>
            <option value="Dorm Utilities">Dorm Utilities</option>
            <option value="Clothes">Clothes</option>
            <option value="Directions">Directions</option>
            <option value="Events">Events</option>
          </select>
          <IoIosArrowDown className='dropdown-icon'/>
        </div>
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
        <div className="icon-wrapper">
          <FaHeart className='icon' onClick={handleGoToFavorites} />
          <span className="tooltip">Favorites</span>
        </div>
        <div className="icon-wrapper">
          <GrLanguage className='icon' />
          <span className="tooltip">Language</span>
        </div>
      </div>
    </div>
  )
}

export default SearchForm

