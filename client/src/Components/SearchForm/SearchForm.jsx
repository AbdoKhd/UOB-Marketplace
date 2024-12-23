import React, {useState, useEffect, useRef} from 'react'
import './SearchForm.css'
import { FaHeart } from "react-icons/fa";
import { GrLanguage } from "react-icons/gr";
import { IoIosSearch, IoIosArrowDown } from "react-icons/io";

import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Components/AuthContext';

const SearchForm = ({urlSearchQuery, urlCategory}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {loggedInUserId} = useAuth();

  const [searchQuery, setSearchQuery] = useState(urlSearchQuery || "");

  const [selectedCategory, setSelectedCategory] = useState(urlCategory || "All");
  const [dropdownWidth, setDropdownWidth] = useState("auto");
  const selectRef = useRef(null);

  // Update selectedCategory and searchQuery when the URL changes
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const newCategory = decodeURIComponent(pathParts[2] || "All");
    const newSearchQuery = pathParts[4] ? decodeURIComponent(pathParts[4]) : "";

    if (newCategory !== selectedCategory) {
      setSelectedCategory(newCategory);
    }
    if (newSearchQuery !== searchQuery) {
      setSearchQuery(newSearchQuery);
    }
  }, [location]);

  useEffect(() => {
    // Adjusting dropdown width based on the selected option's text
    if (selectRef.current) {
      const tempSpan = document.createElement("span");
      tempSpan.style.font = getComputedStyle(selectRef.current).font;
      tempSpan.style.visibility = "hidden";
      tempSpan.style.whiteSpace = "nowrap";
      tempSpan.innerText = selectedCategory || "All";
      document.body.appendChild(tempSpan);
      setDropdownWidth(tempSpan.offsetWidth + 50 + "px"); // Add extra space for padding and arrow
      document.body.removeChild(tempSpan);
    }

  }, [selectedCategory]);


  const handleSearch = () => {
    if(searchQuery === ""){
      navigate(`/listings/${selectedCategory}`);
    }
    if (searchQuery.trim()) {
      navigate(`/listings/${selectedCategory}/search/${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleGoToFavorites = () =>{
    navigate(`/otherListings/My Favorites/${loggedInUserId}`);
  }

  return (
    <div className='search-form'>
      <div className='search-form-left'>
        <div className='dropdown-wrapper' >
          <select className='category-dropdown' style={{ width: dropdownWidth }} value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} ref={selectRef}>
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
        <FaHeart className='icon' onClick={handleGoToFavorites}/>
        <GrLanguage className='icon'/>
      </div>
    </div>
  )
}

export default SearchForm

