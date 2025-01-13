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

  const { category, order, campus, pgn, searchQuery } = useParams();

  const [loading, setLoading] = useState(true);

  const [listings, setListings] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [myFavorites, setMyFavorites] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(order);
  const [selectedCampus, setSelectedCampus] = useState(campus);

  //Notifications from other pages (sell, delete Listing ...)
  useEffect(() => {

    if(location.state?.alert){
      toast.info(location.state.alert);
      // Clear the state after showing the notification
      navigate(location.pathname, { replace: true, state: {} });
      //The replace option ensures that the current history entry is replaced with the new state, rather than adding a new entry to the backstack.
    }

    if (!loading && location.state?.notification) {

      setTimeout(() => {
        toast.success(location.state.notification);
        // Clear the state after showing the notification
        navigate(location.pathname, { replace: true, state: {} });
        //The replace option ensures that the current history entry is replaced with the new state, rather than adding a new entry to the backstack.
      }, 100);
    }

  }, [loading, location.state]);

  useEffect(() => {

    setSelectedOrder(order);
    setSelectedCampus(campus);

    // Fetch all listings
    const fetchAndSetListings = async (page) => {
      setLoading(true);
      try {
        const data = await fetchListings({ page: page, limit: 50, searchQuery: searchQuery, category: category, sorting: order, campus: campus});
        setListings(data.listings);
        setTotalPages(data.totalPages);
        console.log("total pages: ", data.totalPages);
      } catch (err) {
        console.error('Error fetching all listingsss');
      } finally {
        setLoading(false);
      }
    }

    // Fetching the logged in user to use my favorites
    const fetchLoggedInUser = async () => {
      if(loggedInUserId){
        try {
          const userData = await fetchUser(loggedInUserId);
          setMyFavorites(userData.myFavorites);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchLoggedInUser();
    fetchAndSetListings(pgn);
  }, [loggedInUserId, searchQuery, category, campus, order, location.pathname]);

  // Handle loading and null checks
  if (loading) {
    return (
      <div className='listings'>
        <NavBar/>
        <SearchForm urlSearchQuery={searchQuery} urlCategory={category} urlOrder={order} urlCampus={campus}/>
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
        </div>
        <div className='spinner-wrapper'>
          <div className='spinner'></div>
        </div>
      </div>
    )  
  }

  if (listings.length === 0 || !listings) {
    return (
      <div className='listings'>
        <NavBar/>
        <SearchForm urlSearchQuery={searchQuery} urlCategory={category} urlOrder={order} urlCampus={campus}/>
        <div className='filter-and-matrix'>
          <div className='filter-container'>
            <div className='filter-wrapper'>
              <p>Sort: </p>
              <div className='dropdown-wrapper'>
                <select className='filtering-dropdown' value={selectedOrder} onChange={(e) => { if(!searchQuery){ navigate(`/listings/category/${category}/order/${e.target.value}/campus/${campus}/pgn/1`) }
                                                                                              else{navigate(`/listings/category/${category}/order/${e.target.value}/campus/${campus}/search/${searchQuery}/pgn/1`)}
                                                                                              }}>
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
                <select className='filtering-dropdown' value={selectedCampus} onChange={(e) => { if(!searchQuery){ navigate(`/listings/category/${category}/order/${order}/campus/${e.target.value}/pgn/1`) }
                                                                                               else{navigate(`/listings/category/${category}/order/${order}/campus/${e.target.value}/search/${searchQuery}/pgn/1`)}
                                                                                              }}>
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
        </div>
        <div className='spinner-wrapper'>
          <h3 style={{marginBottom: "10px"}}> No Results found for:</h3>
          <p>{category !== "All" && ` Category: ${category}`}</p>
          <p>{searchQuery && ` Search: "${searchQuery}"`}</p>
          <p>{campus !== "All" && ` Campus: ${campus}`}</p>
          <p>{(totalPages > 0 && pgn > totalPages) ?  ` Page: ${pgn}` : ''}</p>
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
      <SearchForm urlSearchQuery={searchQuery} urlCategory={category} urlOrder={order} urlCampus={campus}/>
      <div className='filter-and-matrix'>
        <div className='filter-container'>
          <div className='filter-wrapper'>
            <p>Sort: </p>
            <div className='dropdown-wrapper'>
              <select className='filtering-dropdown' value={selectedOrder} onChange={(e) => { if(!searchQuery){ navigate(`/listings/category/${category}/order/${e.target.value}/campus/${campus}/pgn/1`) }
                                                                                              else{navigate(`/listings/category/${category}/order/${e.target.value}/campus/${campus}/search/${searchQuery}/pgn/1`)}
                                                                                              }}>
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
              <select className='filtering-dropdown' value={selectedCampus} onChange={(e) => { if(!searchQuery){ navigate(`/listings/category/${category}/order/${order}/campus/${e.target.value}/pgn/1`) }
                                                                                               else{navigate(`/listings/category/${category}/order/${order}/campus/${e.target.value}/search/${searchQuery}/pgn/1`)}
                                                                                              }}>
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
          currentPage={Number(pgn)}
          totalPages={totalPages}
          onPageChange={(page) => { if(!searchQuery){ navigate(`/listings/category/${category}/order/${order}/campus/${campus}/pgn/${page}`) }
                                    else{navigate(`/listings/category/${category}/order/${order}/campus/${campus}/search/${searchQuery}/pgn/${page}`)}
                                  }}
        />
      </div>
    </div>
  )
}

export default ListingsPage

