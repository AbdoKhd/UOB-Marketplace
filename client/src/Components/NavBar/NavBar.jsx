import { useState, useEffect } from 'react';
import axios from 'axios';
import React from 'react'
import './NavBar.css'
import { NavLink, useLocation } from 'react-router-dom';
import logo from '../../Assets/UOB-logo.png'


const NavBar = () => {

  const [darkNavbar, setDarkNavBar] = useState(false)
  const location = useLocation();

  useEffect(() => {
    // If we're on the homepage, add scroll event listener
    if (location.pathname === '/') {
      const handleScroll = () => {
        window.scrollY > 30 ? setDarkNavBar(true) : setDarkNavBar(false);
      };

      window.addEventListener('scroll', handleScroll);

      // Clean up the event listener on component unmount
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    } else {
      // If not on the homepage, set the navbar to dark by default
      setDarkNavBar(true);
    }
  }, [location.pathname]);

  return (
    <nav className={`nav ${darkNavbar? 'dark-nav' : ''}`}>
      <NavLink to='/' className='logo'>
        <img src={logo} className='logo-img' />
      </NavLink>
      <ul className='list'>
          <li> <NavLink to='/listings' activeClassName='active'>Listings</NavLink></li>
          <li> <NavLink to='/login' activeClassName='active'>Login</NavLink></li>
          <li> <NavLink to='/register' activeClassName='active'>Sign up</NavLink></li>
      </ul>
    </nav>
  )
}

export default NavBar

