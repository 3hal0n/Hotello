import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import useApi from '../hooks/useApi';
import ImageGallery from '../components/ImageGallery';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import { MapPin, Star, Calendar, Users, Shield, Award, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { mockHotels } from '../data/mockHotels';

export default function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const api = useApi();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Toast state
  const [toast, setToast] = useState(null);
  
  // Booking form state
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [nights, setNights] = useState(0);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (type, message, icon) => {
    setToast({ type, message, icon });
  };

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
        console.error('Backend not available, using mock data:', err);
        // Use mock data when backend is unavailable
        const mockHotel = mockHotels.find(h => h._id === id);
        if (mockHotel) {
          setHotel(mockHotel);
          setError(null);
        } else {
          setError('Hotel not found');
        }
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
      showToast('warning', 'Please sign in to book', <AlertCircle />);
      return;
    }
    if (!checkIn || !checkOut) {
      showToast('warning', 'Please select check-in and check-out dates', <AlertCircle />);
      return;
    }
    if (nights <= 0) {
      showToast('warning', 'Check-out date must be after check-in date', <AlertCircle />);
      return;
    }
    // Navigate to booking page with dates
    navigate(`/booking/${hotel._id}?checkIn=${checkIn}&checkOut=${checkOut}`);
  };

  const addToWishlist = async () => {
    if (!isSignedIn) {
      showToast('warning', 'Please sign in to add to wishlist', <AlertCircle />);
      return;
    }
    try {
      const res = await api.fetchWishlist();
      let hotels = [];
      if (res && res.success && res.data && Array.isArray(res.data.hotels)) {
        hotels = res.data.hotels.map(h => (typeof h === 'string' ? h : h._id));
      }
      if (!hotels.includes(hotel._id)) hotels.push(hotel._id);
      await api.updateWishlist({ hotels });
      showToast('success', 'Added to wishlist', <CheckCircle />);
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to add to wishlist', <XCircle />);
    }
  };

  const addToCart = async () => {
    if (!isSignedIn) {
      showToast('warning', 'Please sign in to add to cart', <AlertCircle />);
      return;
    }
    try {
      const res = await api.fetchCart();
      let items = [];
      if (res && res.success && res.data && Array.isArray(res.data.items)) {
        items = res.data.items;
      }
      const item = {
        hotelId: hotel._id,
        roomType: hotel.roomTypes && hotel.roomTypes[0] ? hotel.roomTypes[0].type : '',
        checkIn: null,
        checkOut: null,
        guests: 1,
        price: hotel.pricePerNight,
        image: hotel.images && hotel.images[0] ? hotel.images[0].url : '',
      };
      items.push(item);
      await api.updateCart({ items });
      showToast('success', 'Added to cart', <CheckCircle />);
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to add to cart', <XCircle />);
    }
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
    <>
      <Navbar />
      {toast && <Toast type={toast.type} message={toast.message} icon={toast.icon} onClose={() => setToast(null)} />}
      <main className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button 
            onClick={() => navigate('/')}
            className="mb-6 text-blue-600 hover:text-blue-700 flex items-center group transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Hotels
          </button>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Advanced Image Gallery */}
            <div className="p-6">
              <ImageGallery images={hotel.images || []} hotelName={hotel.name} />
            </div>

            {/* Hotel Info Section */}
            <div className="px-6 pb-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Hotel Info */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Header */}
                  <div className="border-b border-gray-200 pb-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">{hotel.name}</h1>
                        <div className="flex items-center text-gray-600 text-lg">
                          <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                          {hotel.location}
                        </div>
                      </div>
                      {hotel.rating > 0 && (
                        <div className="flex flex-col items-end">
                          <div className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-xl shadow-lg">
                            <Star className="w-5 h-5 mr-1 fill-current" />
                            <span className="text-2xl font-bold">{hotel.rating.toFixed(1)}</span>
                          </div>
                          <span className="text-sm text-gray-500 mt-1">Excellent</span>
                        </div>
                      )}
                    </div>

                    {/* Quick Stats */}
                    <div className="flex flex-wrap gap-4 mt-6">
                      <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
                        <Shield className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-700">Verified Property</span>
                      </div>
                      <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-lg">
                        <Award className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">Premium Hotel</span>
                      </div>
                      {hotel.roomTypes && hotel.roomTypes.length > 0 && (
                        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                          <Users className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-blue-700">{hotel.roomTypes.length} Room Types</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* About Section */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-1 h-6 bg-blue-600 mr-3 rounded-full"></span>
                      About This Hotel
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-lg">{hotel.description}</p>
                  </div>

                  {/* Amenities Section */}
                  {hotel.amenities && hotel.amenities.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="w-1 h-6 bg-blue-600 mr-3 rounded-full"></span>
                        Amenities & Services
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {hotel.amenities.map((amenity, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors group">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="text-gray-700 font-medium">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Room Types */}
                  {hotel.roomTypes && hotel.roomTypes.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="w-1 h-6 bg-blue-600 mr-3 rounded-full"></span>
                        Available Room Types
                      </h2>
                      <div className="space-y-4">
                        {hotel.roomTypes.map((room, idx) => (
                          <div key={idx} className="p-6 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{room.type}</h3>
                                <p className="text-gray-600">
                                  <span className="inline-flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    {room.available} rooms available
                                  </span>
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-3xl font-bold text-blue-600">${room.price}</p>
                                <p className="text-sm text-gray-500">per night</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Policies */}
                  {hotel.policies && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Hotel Policies
                      </h3>
                      <p className="text-gray-700">{hotel.policies}</p>
                    </div>
                  )}
                </div>

                {/* Right Column - Booking Card */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 shadow-xl border border-blue-100">
                    {/* Price Display */}
                    <div className="mb-6 text-center pb-6 border-b border-blue-200">
                      <p className="text-sm text-gray-600 mb-1">Starting from</p>
                      <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        ${hotel.pricePerNight}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">per night</p>
                    </div>

                    {/* Date Selection */}
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                          Check-in
                        </label>
                        <input
                          type="date"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                          Check-out
                        </label>
                        <input
                          type="date"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          min={checkIn || new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    {nights > 0 && (
                      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
                        <div className="flex justify-between mb-3 text-gray-700">
                          <span>${hotel.pricePerNight} × {nights} night{nights !== 1 ? 's' : ''}</span>
                          <span className="font-semibold">${totalPrice}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                          <span className="font-bold text-gray-900">Total</span>
                          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            ${totalPrice}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Reserve Button */}
                    <button
                      onClick={handleBooking}
                      disabled={!checkIn || !checkOut || nights <= 0}
                      className="relative w-full py-4 text-base font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/50 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed disabled:hover:shadow-none mb-4"
                    >
                      <span className="relative z-10">
                        {isSignedIn ? '🎉 Reserve Now' : '🔐 Sign in to Book'}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
                      </div>
                    </button>

                    {!isSignedIn && (
                      <p className="text-xs text-gray-500 text-center mb-4">
                        You need to sign in to make a booking
                      </p>
                    )}

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={addToCart} 
                        className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all font-medium text-gray-700 hover:text-blue-600"
                      >
                        🛒 Add to Cart
                      </button>
                      <button 
                        onClick={addToWishlist} 
                        className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-pink-500 hover:shadow-md transition-all font-medium text-gray-700 hover:text-pink-600"
                      >
                        ❤️ Wishlist
                      </button>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-6 pt-6 border-t border-blue-200">
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <Shield className="w-4 h-4 text-green-600" />
                        <span>Secure booking · Free cancellation</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
