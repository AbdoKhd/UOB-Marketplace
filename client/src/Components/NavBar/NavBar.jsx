import { useState, useEffect } from 'react';
import { useAuth } from '../../Components/AuthContext'
import React from 'react'
import './NavBar.css'
import { NavLink, useLocation } from 'react-router-dom';
import logo from '../../Assets/balamad abed_UOB Marketplace 3.png'
import { HiOutlineMenuAlt2 } from "react-icons/hi";


const NavBar = () => {
  const location = useLocation();

  const [darkNavbar, setDarkNavBar] = useState(location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/forgotPassword')

  const { isAuthenticated } = useAuth();

  const[isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    // If we're on the homepage, add scroll event listener to change the navBar's backround color
    if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgotPassword') {
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
        <li> <NavLink to='/listings/category/All/order/Newest First/campus/All/pgn/1' className={({ isActive }) => isActive || location.pathname.startsWith('/listings') ? 'active' : undefined}>Browse</NavLink></li>
        
        {isAuthenticated ? (
          <>
            <li> <NavLink to='/sell' className={({ isActive }) => (isActive ? "active" : undefined)}>Sell</NavLink></li>
            <li> <NavLink to="/messages/" className={({ isActive }) => (isActive ? "active" : undefined)}>Messages</NavLink></li>
            <li> <NavLink to='/profile' className={({ isActive }) => (isActive ? "active" : undefined)}>Profile</NavLink></li>
          </>
        ) : (
          <>
            <li> <NavLink to='/login' className={({ isActive }) => (isActive ? "active" : undefined)}>Login</NavLink></li>
            <li> <NavLink to='/register' className={({ isActive }) => (isActive ? "active" : undefined)}>Sign up</NavLink></li>
          </>
        )}
      </ul>
      <HiOutlineMenuAlt2 className='menu-icon' onClick={toggleMenu} />
    </nav>
  )
}

export default NavBar

