import React from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import HotelDetails from './pages/HotelDetails.jsx';
import Booking from './pages/Booking.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/hotels/:id' element={<HotelDetails />} />
        <Route path='/booking/:id' element={<Booking />} />
      </Routes>
    </BrowserRouter>
  );
}