import React from 'react'
import NavBar from '../../Components/NavBar/NavBar'
import './ListingsPage.css'
import SearchForm from '../../Components/SearchForm/SearchForm'
import CategoryBar from '../../Components/CategoryBar/CategoryBar'
import Listing from '../../Components/Listing/Listing'
import ListingsMatrix from '../../Components/ListingsMatrix/ListingsMatrix'

const ListingsPage = () => {
  return (
    <div className='listings'>
      <NavBar/>
      <SearchForm/>
      <div className='divider'/>
      <CategoryBar/>
      <div className='filter-and-matrix'>
        <div className='filter-container'>

        </div>
        <div className='matrix-container'>
          <ListingsMatrix/>
        </div>
      </div>
    </div>
  )
}

export default ListingsPage

