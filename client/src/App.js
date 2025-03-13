
import './App.css';
import { AuthProvider } from './Components/AuthContext' ;
import { SocketProvider } from "./socketContext";
import LoginForm from './Pages/LoginForm/LoginForm';
import RegistrationForm from './Pages/RegistrationForm/RegistrationForm';
import ForgotPasswordForm from './Pages/ForgotPasswordForm/ForgotPasswordForm';
import {Route, Routes} from 'react-router-dom';
import HomePage from './Pages/HomePage/HomePage';
import ListingsPage from './Pages/ListingsPage/ListingsPage';
import SellPage from './Pages/SellPage/SellPage';
import ProfilePage from './Pages/ProfilePage/ProfilePage';
import ProtectedRouteLoggedOut from './Components/ProtectedRouteLoggedOut';
import ProtectedRouteLoggedIn from './Components/ProtectedRouteLoggedIn';
import ListingDetailsPage from './Pages/ListingDetailsPage/ListingDetailsPage';
import UserPage from './Pages/UserPage/UserPage';
import OtherListingsPage from './Pages/OtherListingsPage/OtherListingsPage';
import MessagesPage from './Pages/MessagesPage/MessagesPage'

function App() {
  return (
    <SocketProvider>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={ <ProtectedRouteLoggedIn> <LoginForm /> </ProtectedRouteLoggedIn>} />
          <Route path="/register" element={ <ProtectedRouteLoggedIn> <RegistrationForm /> </ProtectedRouteLoggedIn>} />
          <Route path="/forgotPassword" element={ <ProtectedRouteLoggedIn> <ForgotPasswordForm /> </ProtectedRouteLoggedIn>} />
          <Route path="/" element={<HomePage />} />
          <Route path="/listingDetails/:listingId" element={<ListingDetailsPage/>} />
          <Route path="/listings/category/:category/order/:order/campus/:campus/pgn/:pgn" element={<ListingsPage />} />
          <Route path="/listings/category/:category/order/:order/campus/:campus/search/:searchQuery/pgn/:pgn" element={<ListingsPage />} />
          <Route path="/sell" element={ <ProtectedRouteLoggedOut> <SellPage/> </ProtectedRouteLoggedOut>} />
          <Route path="/messages" element={ <ProtectedRouteLoggedOut> <MessagesPage/> </ProtectedRouteLoggedOut>} />
          <Route path="/messages/:conversationId" element={ <ProtectedRouteLoggedOut> <MessagesPage/> </ProtectedRouteLoggedOut>} />
          <Route path="/profile" element={ <ProtectedRouteLoggedOut> <ProfilePage/> </ProtectedRouteLoggedOut>} />
          <Route path="/user/:userId" element={ <UserPage/>} />
          <Route path="/otherListings/:userId/:type" element={ <OtherListingsPage/>} /> 
          {/* 'type' in the path above refers to either favorites or listings */}
        </Routes>
      </AuthProvider>
    </SocketProvider>
  )
}

export default App;
