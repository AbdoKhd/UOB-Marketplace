import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import NavBar from '../../Components/NavBar/NavBar'
import './ListingsPage.css'
import SearchForm from '../../Components/SearchForm/SearchForm'
import CategoryBar from '../../Components/CategoryBar/CategoryBar'
import ListingsMatrix from '../../Components/ListingsMatrix/ListingsMatrix'

// React Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ScrollToTop from '../../Components/ScrollToTop/ScrollToTop';

const ListingsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.notification) {

      toast.success(location.state.notification);

      // Clear the state after showing the notification
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

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
          <ListingsMatrix/>
        </div>
      </div>
    </div>
  )
}

export default ListingsPage

