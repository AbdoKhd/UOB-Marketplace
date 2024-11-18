import {useState, useEffect} from 'react'
import './OtherListingsPage.css'
import { useLocation } from 'react-router-dom';
import NavBar from '../../Components/NavBar/NavBar';
import ListingsGrid from '../../Components/ListingsGrid/ListingsGrid';
import http from '../../http-common';
import { useAuth } from '../../Components/AuthContext';

const OtherListingsPage = () => {

  const location = useLocation();
  const { pageTitle, userId } = location.state || {};
  const {loggedInUserId} = useAuth();

  const [user, setUser] = useState();
  const [myFavorites, setMyFavorites] = useState([]);

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    // Fetching the user that we want to see the listings of
    const fetchUser = async () => {
      try{
        const userResponse = await http.get(`/api/users/getUser/${userId}`);
        setUser(userResponse.data.user);

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
        const userResponse = await http.get(`/api/users/getUser/${loggedInUserId}`);
        setMyFavorites(userResponse.data.user.myFavorites);
        setLoading(false);

      }catch(error){
        console.error('Error fetching the logged in user:', error);
      }
    }

    fetchUser();
    fetchLoggedInUser();
  }, [userId, loggedInUserId]);

  useEffect(() => {
    if (user && user.myListings) {
      // Determine which list of IDs to use based on `pageTitle`. if the title ens with favorites then the listings should be user.myFavorites
      const isFavorites = pageTitle && pageTitle.trim().split(' ').pop().toLowerCase() === 'favorites';
      const listingsId = isFavorites ? myFavorites : user.myListings;

      // Fetch listings only if `user` and `user.myListings` are available
      const fetchListings = async () => {
        try {
          const listingsResponse = await http.post('/api/listings/getListingsByIds', {
            listingsId: listingsId,
          });
          setListings(listingsResponse.data.listings);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching the listings:', error);
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

  if (!listings || listings.length === 0) {
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
      <NavBar/>
      <div className='title-container'>
        <h2>{pageTitle}</h2>
      </div>
      <ListingsGrid listings={listings} myFavorites={myFavorites}/>
    </div>
  )
}

export default OtherListingsPage