import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

export default function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Booking form state
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [nights, setNights] = useState(0);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE || ''}/api/hotels/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setHotel(data.data);
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
  }, [id]);

  // Calculate price when dates change
  useEffect(() => {
    if (checkIn && checkOut && hotel) {
      const ci = new Date(checkIn);
      const co = new Date(checkOut);
      if (co > ci) {
        const nightsCount = Math.ceil((co - ci) / (1000 * 60 * 60 * 24));
        setNights(nightsCount);
        setTotalPrice(nightsCount * hotel.pricePerNight);
      } else {
        setNights(0);
        setTotalPrice(0);
      }
    }
  }, [checkIn, checkOut, hotel]);

  const handleBooking = () => {
    if (!isSignedIn) {
      alert('Please sign in to book');
      return;
    }
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }
    if (nights <= 0) {
      alert('Check-out date must be after check-in date');
      return;
    }
    // Navigate to booking page with dates
    navigate(`/booking/${hotel._id}?checkIn=${checkIn}&checkOut=${checkOut}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-gray-600">Loading hotel details...</p>
        </div>
      </main>
    );
  }

  if (error || !hotel) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-red-600">{error || 'Hotel not found'}</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 mx-auto block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Hotels
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="mb-4 text-blue-600 hover:text-blue-700 flex items-center"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Hotels
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hotel Images */}
          {hotel.images && hotel.images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
              <img 
                src={hotel.images[0].url} 
                alt={hotel.name}
                className="w-full h-96 object-cover rounded-lg"
              />
              {hotel.images.length > 1 && (
                <div className="grid grid-cols-2 gap-2">
                  {hotel.images.slice(1, 5).map((img, idx) => (
                    <img 
                      key={idx}
                      src={img.url} 
                      alt={`${hotel.name} ${idx + 2}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No images available</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
            {/* Hotel Info */}
            <div className="lg:col-span-2">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{hotel.name}</h1>
              
              <div className="flex items-center text-gray-600 mb-4">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {hotel.location}
              </div>

              {hotel.rating > 0 && (
                <div className="flex items-center mb-6">
                  <span className="text-yellow-500 text-xl">★</span>
                  <span className="ml-2 text-xl font-semibold">{hotel.rating.toFixed(1)}</span>
                  <span className="ml-2 text-gray-600">Rating</span>
                </div>
              )}

              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">About this hotel</h2>
                <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
              </div>

              {hotel.amenities && hotel.amenities.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {hotel.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
                <div className="mb-6">
                  <p className="text-sm text-gray-600">Price per night</p>
                  <p className="text-3xl font-bold text-blue-600">${hotel.pricePerNight}</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-in
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-out
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {nights > 0 && (
                  <div className="bg-white rounded-lg p-4 mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">
                        ${hotel.pricePerNight} × {nights} night{nights !== 1 ? 's' : ''}
                      </span>
                      <span className="font-semibold">${totalPrice}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="text-xl font-bold text-blue-600">${totalPrice}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBooking}
                  disabled={!checkIn || !checkOut || nights <= 0}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSignedIn ? 'Reserve' : 'Sign in to Book'}
                </button>

                {!isSignedIn && (
                  <p className="text-sm text-gray-500 text-center mt-3">
                    You need to sign in to make a booking
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
