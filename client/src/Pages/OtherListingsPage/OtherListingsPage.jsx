import {useState, useEffect} from 'react'
import './OtherListingsPage.css'
import { useLocation, useParams, useNavigate } from 'react-router-dom';
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

  const { userId, type } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const {loggedInUserId} = useAuth();

  const [title, setTitle] = useState("");
  const [user, setUser] = useState();
  const [myFavorites, setMyFavorites] = useState([]);

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if(location.state?.alert){
      toast.info(location.state.alert);
      // Clear the state after showing the notification
      navigate(location.pathname, { replace: true, state: {} });
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
    if (user) {

      let listingsId;

      //If it is not the loggedInUser, always display Listings of the user (Never Favorites)
      if(userId !== loggedInUserId){
        setTitle(user.firstName + "'s listings");
        listingsId = user.myListings;
      }
      //If it IS the loggedInUser, then check the type to know whether to display listings or favorites.
      else{
        if(type === "Favorites"){
          setTitle("My Favorites");
          listingsId = user.myFavorites;
        }
        else if(type === "Listings"){
          setTitle("My Listings");
          listingsId = user.myListings;
        }
      }
      
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
      <div className='other-listings-page'>
        <NavBar/>
        <div className='title-container'>
          <h2>{title}</h2>
        </div>
        <div className='spinner-wrapper'>
          <div className='spinner'></div>
        </div>
      </div>
    )  
  }

  if (listings.length === 0) {
    return (
      <div className='other-listings-page'>
        <NavBar/>
        <div className='title-container'>
          <h2>{title}</h2>
        </div>
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
        <h2>{title}</h2>
      </div>
      <ListingsGrid listings={listings} myFavorites={myFavorites}/>
    </div>
  )
}

export default OtherListingsPage