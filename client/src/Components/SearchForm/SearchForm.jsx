import React from 'react'
import './SearchForm.css'
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { GrLanguage } from "react-icons/gr";
import { IoIosSearch } from "react-icons/io";

const SearchForm = () => {
  return (
    <div className='search-form'>
      <div className='search-form-left'>
        <input type="text" placeholder="Search for laptops, books, notes, previous exams, clothes ..." className='search-input'></input>
        <button className='btn search-btn'>
          <IoIosSearch className='search-icon'/>
        </button>
        
      </div>
      <div className='search-form-right'>
        <FaHeart className='icon'/>
        <GrLanguage className='icon'/>
      </div>
    </div>
  )
}

export default SearchForm

