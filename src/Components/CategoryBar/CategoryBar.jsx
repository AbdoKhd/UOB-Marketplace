import React from 'react'
import { NavLink } from 'react-router-dom'
import './CategoryBar.css'

const CategoryBar = () => {
  return (
    <div className='category-bar'>
      <NavLink className='category-btn' to='#' activeClassName="activee">All</NavLink>
      <NavLink className='category-btn' to='#' activeClassName="activee">Electronics</NavLink>
      <NavLink className='category-btn' to='#' activeClassName="activee">Univ Tools</NavLink>
      <NavLink className='category-btn' to='#' activeClassName="activee">Clothes</NavLink>
      <NavLink className='category-btn' to='#' activeClassName="activee">Directions</NavLink>
      <NavLink className='category-btn' to='#' activeClassName="activee">Tutoring</NavLink>
      <NavLink className='category-btn' to='#' activeClassName="activee">Events</NavLink>
    </div>
  )
}

export default CategoryBar