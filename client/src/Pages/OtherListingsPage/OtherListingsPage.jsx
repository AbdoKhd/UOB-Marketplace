import {useState, useEffect} from 'react'
import './OtherListingsPage.css'
import { useLocation, useParams } from 'react-router-dom';
import NavBar from '../../Components/NavBar/NavBar';
import ListingsGrid from '../../Components/ListingsGrid/ListingsGrid';
import {fetchUser} from '../../Services/userService';
import { fetchListingsByIds } from '../../Services/listingService';
import { useAuth } from '../../Components/AuthContext';
import ScrollToTop from '../../Components/ScrollToTop/ScrollToTop';

// React Toastify
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OtherListingsPage = () => {

  const { pageTitle, userId } = useParams();
  const location = useLocation();

  const {loggedInUserId} = useAuth();

  const [user, setUser] = useState();
  const [myFavorites, setMyFavorites] = useState([]);

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if(location.state?.alert){
      toast.info(location.state.alert);
    }

  }, [location.state]);


  useEffect(() => {

    // Fetching the user that we want to see the listings of
    const getUser = async () => {
      try{
        const userResponse = await fetchUser(userId);
        setUser(userResponse);

      }catch(error){
        console.error('Error fetching the user:', error);
      }
    }

    // Fetching the logged in user to use my favorites
    const fetchLoggedInUser = async () =>{
      if(!loggedInUserId){
        return null;
      }
      try{
        const userResponse = await fetchUser(loggedInUserId);
        setMyFavorites(userResponse.myFavorites);

      }catch(error){
        console.error('Error fetching the logged in user:', error);
      }
    }

    getUser();
    fetchLoggedInUser();
  }, [userId, loggedInUserId]);

  useEffect(() => {
    if (user && user.myListings) {
      // Determine which list of IDs to use based on `pageTitle`. if the title ends with favorites then the listings should be user.myFavorites
      const isFavorites = pageTitle && pageTitle.trim().split(' ').pop().toLowerCase() === 'favorites';
      const listingsId = isFavorites ? myFavorites : user.myListings;

      // Fetch listings only if `user` and `user.myListings` are available
      const fetchListings = async () => {
        try {
          const listingsResponse = await fetchListingsByIds(listingsId);
          setListings(listingsResponse.listings);
        } catch (error) {
          console.error('Error fetching the listings:', error);
        } finally{
          setLoading(false);
        }
        
      };
  
      fetchListings();
    }
  }, [user]);


  // Handle loading and null checks
  if (loading) {
    return (
      <div>
        <NavBar/>
        <div className='spinner-wrapper'>
          <div className='spinner'></div>
        </div>
      </div>
    )  
  }

  if (listings.length === 0) {
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
    <div className='other-listings-page'>
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
      <div className='title-container'>
        <h2>{pageTitle}</h2>
      </div>
      <ListingsGrid listings={listings} myFavorites={myFavorites}/>
    </div>
  )
}

export default OtherListingsPage