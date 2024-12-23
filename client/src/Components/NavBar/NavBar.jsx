import { useState, useEffect } from 'react';
import { useAuth } from '../../Components/AuthContext'
import React from 'react'
import './NavBar.css'
import { NavLink, useLocation } from 'react-router-dom';
import logo from '../../Assets/balamad abed_UOB Marketplace 3.png'
import { HiOutlineMenuAlt2 } from "react-icons/hi";


const NavBar = () => {

  const [darkNavbar, setDarkNavBar] = useState(false)
  const location = useLocation();

  const { isAuthenticated } = useAuth();

  const[isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    // If we're on the homepage, add scroll event listener
    if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') {
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
    <nav className={`nav ${darkNavbar ? 'dark-nav' : ''}`}>
      <NavLink to='/' className='logo'>
        <img src={logo} className='logo-img' alt='Logo' />
      </NavLink>
      <ul style={{ right: isMenuOpen ? '0' : '-200px', transition: 'right 0.5s ease'}}>
        <li> <NavLink to='/listings/All' activeClassName='active'>Listings</NavLink></li>
        
        {isAuthenticated ? (
          <>
            <li> <NavLink to='/sell' activeClassName='active'>Sell</NavLink></li>
            <li> <NavLink to="/messages/" activeClassName='active'>Messages</NavLink></li>
            <li> <NavLink to='/profile' activeClassName='active'>Profile</NavLink></li>
          </>
        ) : (
          <>
            <li> <NavLink to='/login' activeClassName='active'>Login</NavLink></li>
            <li> <NavLink to='/register' activeClassName='active'>Sign up</NavLink></li>
          </>
        )}
      </ul>
      <HiOutlineMenuAlt2 className='menu-icon' onClick={toggleMenu} />
    </nav>
  )
}

export default NavBar

