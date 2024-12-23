import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NavBar from '../../Components/NavBar/NavBar'
import Pagination from '../../Components/Pagination/Pagination';
import './ListingsPage.css'
import SearchForm from '../../Components/SearchForm/SearchForm'
import { useAuth } from '../../Components/AuthContext';
import { fetchUser } from '../../Services/userService';
import { fetchAllListings, fetchListings } from '../../Services/listingService';
import { IoIosArrowDown } from "react-icons/io";

// React Toastify
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ScrollToTop from '../../Components/ScrollToTop/ScrollToTop';
import ListingsGrid from '../../Components/ListingsGrid/ListingsGrid';

const ListingsPage = () => {
  
  const location = useLocation();
  const navigate = useNavigate();

  const { loggedInUserId } = useAuth();

  const { category, searchQuery } = useParams();
  console.log("this is search query in listings page: ", searchQuery);
  console.log("selected category in listings page: ", category);

  const [loading, setLoading] = useState(true);

  const [listings, setListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [myFavorites, setMyFavorites] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState("Oldest First");
  const [selectedCampus, setSelectedCampus] = useState("All");

  //Notifications from other pages (sell, delete Listing ...)
  useEffect(() => {

    if(location.state?.alert){
      toast.info(location.state.alert);
      // Clear the state after showing the notification
      navigate(location.pathname, { replace: true, state: {} });
    }

    if (!loading && location.state?.notification) {

      setTimeout(() => {
        toast.success(location.state.notification);
        // Clear the state after showing the notification
        navigate(location.pathname, { replace: true, state: {} });
      }, 100);
    }

  }, [loading, location.state]);

  // Fetch all listings
  const fetchAndSetListings = async (page = 1) =>{
    setLoading(true);
    try {
      const data = await fetchListings({ page });
      setListings(data.listings);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Error fetching all listingsss');
    } finally {
      setLoading(false);
    }
  }

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

    fetchLoggedInUser();
    fetchAndSetListings();
  }, [loggedInUserId, searchQuery, category]);

  useEffect(() => {
    
  }, [selectedOrder]);

  useEffect(() =>{
    
  }, [selectedCampus]);

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
      <SearchForm urlSearchQuery={searchQuery} urlCategory={category}/>
      <div className='filter-and-matrix'>
        <div className='filter-container'>
          <div className='filter-wrapper'>
            <p>Sort: </p>
            <div className='dropdown-wrapper'>
              <select className='filtering-dropdown' value={selectedOrder} onChange={(e) => setSelectedOrder(e.target.value)}>
                <option value="Newest First">Newest First</option>
                <option value="Oldest First">Oldest First</option>
                <option value="Alphabetical Order">Alphabetical Order</option>
                <option value="Price: Highest First">Price: Highest First</option>
                <option value="Price: Lowest First">Price: Lowest First</option>
              </select>
              <IoIosArrowDown className='dropdown-icon'/>
            </div>
          </div>
          <div className='filter-wrapper'>
            <p>Campus: </p>
            <div className='dropdown-wrapper'>
              <select className='filtering-dropdown' value={selectedCampus} onChange={(e) => setSelectedCampus(e.target.value)}>
                <option value="All">All</option>
                <option value="Balamand - Al Kurah">Balamand - Al Kurah</option>
                <option value="Souk Al Gharb - Aley">Souk Al Gharb - Aley</option>
                <option value="Beino - Akkar">Beino - Akkar</option>
                <option value="Dekouaneh">Dekouaneh</option>
              </select>
              <IoIosArrowDown className='dropdown-icon'/>
            </div>
          </div>
        </div>
        <div className='matrix-container'>
          <ListingsGrid listings={listings} myFavorites={myFavorites}/>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => fetchAndSetListings(page)}
        />
      </div>
    </div>
  )
}

export default ListingsPage

