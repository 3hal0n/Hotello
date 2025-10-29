import React from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Hotels from './pages/Hotels.jsx';
import HotelDetails from './pages/HotelDetails.jsx';
import Booking from './pages/Booking.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Profile from './pages/Profile.jsx';
import Cart from './pages/Cart.jsx';
import Wishlist from './pages/Wishlist.jsx';
import Chat from './pages/Chat.jsx';
import MapView from './pages/MapView.jsx';
import PaymentSuccess from './pages/PaymentSuccess.jsx';

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      {/* ...existing code... (Navbar is rendered elsewhere) */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/hotels' element={<Hotels />} />
        <Route path='/hotels/:id' element={<HotelDetails />} />
        <Route path='/booking/:id' element={<Booking />} />
  <Route path='/cart' element={<Cart />} />
  <Route path='/wishlist' element={<Wishlist />} />
  <Route path='/chat' element={<Chat />} />
  <Route path='/map' element={<MapView />} />
  <Route path='/payment-success' element={<PaymentSuccess />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}