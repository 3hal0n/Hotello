import React, { Suspense } from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
const Home = React.lazy(() => import('./pages/Home.jsx'));
const Hotels = React.lazy(() => import('./pages/Hotels.jsx'));
const HotelDetails = React.lazy(() => import('./pages/HotelDetails.jsx'));
const Booking = React.lazy(() => import('./pages/Booking.jsx'));
const About = React.lazy(() => import('./pages/About.jsx'));
const Contact = React.lazy(() => import('./pages/Contact.jsx'));
const Profile = React.lazy(() => import('./pages/Profile.jsx'));
const Cart = React.lazy(() => import('./pages/Cart.jsx'));
const Wishlist = React.lazy(() => import('./pages/Wishlist.jsx'));
const Chat = React.lazy(() => import('./pages/Chat.jsx'));
const MapView = React.lazy(() => import('./pages/MapView.jsx'));
const PaymentSuccess = React.lazy(() => import('./pages/PaymentSuccess.jsx'));
import SEO from './components/SEO.jsx';
// removed lenis to restore native scrolling behavior

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      {/* Dynamic SEO component */}
      <SEO />

      {/* Routes with lazy-loaded pages to improve initial bundle size */}
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
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
      </Suspense>
    </BrowserRouter>
  );
}