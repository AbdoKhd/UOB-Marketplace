import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NavBar from '../../Components/NavBar/NavBar'
import './ListingsPage.css'
import SearchForm from '../../Components/SearchForm/SearchForm'
import CategoryBar from '../../Components/CategoryBar/CategoryBar'
import { useAuth } from '../../Components/AuthContext';
import { fetchUser } from '../../Services/userService';
import { fetchAllListings } from '../../Services/listingService';
// React Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ScrollToTop from '../../Components/ScrollToTop/ScrollToTop';
import ListingsGrid from '../../Components/ListingsGrid/ListingsGrid';

const ListingsPage = () => {

  const { loggedInUserId } = useAuth();

  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [myFavorites, setMyFavorites] = useState([]);

  useEffect(() => {

    if (!loading && location.state?.notification) {

      setTimeout(() => {
        toast.success(location.state.notification);
  
        // Clear the state after showing the notification
        navigate(location.pathname, { replace: true, state: {} });
      }, 100);
    }
  }, [loading, location.state]);

  useEffect(() => {

    // Fetching the logged in user to use my favorites
    const fetchLoggedInUser = async () => {
      try {
        const userData = await fetchUser(loggedInUserId);
        setMyFavorites(userData.myFavorites);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Fetch all listings
    const fetchListings = async() =>{
      try {
        const allListings = await fetchAllListings();
        setListings(allListings);
        setLoading(false);

      } catch (error) {
        console.error('Error fetching all listings:', error);
      }
    }

    fetchLoggedInUser();
    fetchListings();
  }, [loggedInUserId]);

  // Handle loading and null checks
  if (loading) {
    return (
      <div className='listings'>
        <NavBar/>
        <div className='spinner-wrapper'>
          <div className='spinner'></div>
        </div>
      </div>
    )  
  }

  if (listings.length === 0 || !listings) {
    return (
      <div>
        <NavBar/>
        <div className='spinner-wrapper'>
          <p>No listings found!</p>
        </div>
      </div>
    )
  }

  return (
    <div className='listings'>
      <ScrollToTop/>
      <NavBar/>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="light"
      />
      <SearchForm/>
      <div className='divider'/>
      <CategoryBar/>
      <div className='filter-and-matrix'>
        <div className='filter-container'>

        </div>
        <div className='matrix-container'>
          <ListingsGrid listings={listings} myFavorites={myFavorites}/>
        </div>
      </div>
    </div>
  )
}

export default ListingsPage

