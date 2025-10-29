import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getToken, isSignedIn } = useAuth();
  
  const [hotel, setHotel] = useState(null);
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const [roomType, setRoomType] = useState('');
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [nights, setNights] = useState(0);

  useEffect(() => {
    if (!isSignedIn) {
      navigate(`/hotels/${id}`);
      return;
    }

    fetch(`${import.meta.env.VITE_API_BASE || ''}/api/hotels/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setHotel(data.data);
          // Set default room type to the first available room type
          if (data.data.roomTypes && data.data.roomTypes.length > 0) {
            setRoomType(data.data.roomTypes[0].type);
          }
        } else {
          setError('Hotel not found');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load hotel details');
        setLoading(false);
      });
  }, [id, isSignedIn, navigate]);

  // Calculate price when dates or room type change
  useEffect(() => {
    if (checkIn && checkOut && hotel && roomType) {
      const ci = new Date(checkIn);
      const co = new Date(checkOut);
      if (co > ci) {
        const nightsCount = Math.ceil((co - ci) / (1000 * 60 * 60 * 24));
        setNights(nightsCount);
        
        // Find the selected room type price
        const selectedRoom = hotel.roomTypes?.find(rt => rt.type === roomType);
        const pricePerNight = selectedRoom?.price || hotel.pricePerNight;
        setTotalPrice(nightsCount * pricePerNight * guests);
      } else {
        setNights(0);
        setTotalPrice(0);
      }
    }
  }, [checkIn, checkOut, hotel, roomType, guests]);

  async function handlePayNow(e) {
    e.preventDefault();
    
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }
    
    if (nights <= 0) {
      alert('Check-out date must be after check-in date');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_BASE || ''}/api/bookings`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          hotelId: id, 
          checkIn, 
          checkOut,
          roomType,
          guests
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        // In a real app, this would redirect to payment/Stripe checkout
        alert(`Booking created successfully! Booking ID: ${data.data._id}`);
        navigate('/'); // Navigate back to home for now
      } else {
        setError(data.message || 'Booking failed');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to create booking. Please try again.');
    } finally {
      setProcessing(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 pt-20 p-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-center text-gray-600">Loading...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error && !hotel) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 pt-20 p-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-center text-red-600">{error}</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-4 mx-auto block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Back to Hotels
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => navigate(`/hotels/${id}`)}
            className="mb-6 text-blue-600 hover:text-blue-700 flex items-center group transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Hotel Details
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Your Booking</h1>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">{error}</p>
              </div>
            )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Hotel Summary */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Hotel Details</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                {hotel.images && hotel.images[0] && (
                  <img 
                    src={hotel.images[0].url} 
                    alt={hotel.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-2xl font-semibold mb-2">{hotel.name}</h3>
                <p className="text-gray-600 flex items-center mb-4">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {hotel.location}
                </p>
                <p className="text-gray-700 line-clamp-3">{hotel.description}</p>
              </div>
            </div>

            {/* Booking Form */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Booking Information</h2>
              <form onSubmit={handlePayNow} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Type
                  </label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {hotel.roomTypes && hotel.roomTypes.map((rt) => (
                      <option key={rt.type} value={rt.type}>
                        {rt.type} - ${rt.price}/night ({rt.available} available)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                    min="1"
                    max="10"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Price Breakdown */}
                {nights > 0 && roomType && (
                  <div className="bg-blue-50 rounded-lg p-6 space-y-3">
                    <h3 className="font-semibold text-lg mb-4">Price Details</h3>
                    <div className="flex justify-between text-gray-700">
                      <span>{roomType} Room</span>
                      <span>
                        ${hotel.roomTypes?.find(rt => rt.type === roomType)?.price || hotel.pricePerNight}/night
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>
                        {nights} night{nights !== 1 ? 's' : ''} × {guests} guest{guests !== 1 ? 's' : ''}
                      </span>
                      <span>${totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Service fee</span>
                      <span>$0</span>
                    </div>
                    <div className="border-t border-blue-200 pt-3 flex justify-between items-center">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-2xl font-bold text-blue-600">${totalPrice}</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={processing || !checkIn || !checkOut || !roomType || nights <= 0}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {processing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Pay Now
                    </>
                  )}
                </button>

                <p className="text-sm text-gray-500 text-center">
                  By clicking "Pay Now", you agree to our terms and conditions
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
    </>
  );
}
