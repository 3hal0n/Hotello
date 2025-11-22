import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HotelCard from '../components/HotelCard';
import Toast from '../components/Toast';
import useApi from '../hooks/useApi';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Loader2, Trash2, Sparkles, CreditCard, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function Cart() {
  const api = useApi();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [toast, setToast] = useState(null);

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
    if (!isSignedIn) return;
    fetchCart();
    fetchRecommendations();
  }, [isSignedIn]);

  async function fetchCart() {
    try {
      setLoading(true);
      const res = await api.fetchCart();
      if (res && res.success) setCart(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchRecommendations() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/recommendations`);
      const data = await res.json();
      if (data.success && data.data) {
        setRecommendations(data.data.slice(0, 4)); // Get top 4
      }
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    }
  }

  async function removeItem(index) {
    // Optimistically update UI immediately
    const items = (cart && cart.items) ? [...cart.items] : [];
    const updatedItems = items.filter((_, i) => i !== index);
    setCart({ ...cart, items: updatedItems });
    
    // Update backend in background
    try {
      await api.updateCart({ items: updatedItems });
    } catch (err) {
      console.error('Failed to update cart:', err);
      // Revert on error
      setCart({ ...cart, items });
      showToast('error', 'Failed to remove item', <XCircle />);
    }
  }

  async function addToWishlist(hotel) {
    try {
      const res = await api.fetchWishlist();
      const currentHotels = res?.data?.hotels || [];
      const hotelIds = currentHotels.map(h => typeof h === 'string' ? h : h._id);
      
      if (!hotelIds.includes(hotel.hotelId)) {
        await api.updateWishlist({ hotels: [...hotelIds, hotel.hotelId] });
        showToast('success', 'Added to wishlist!', <CheckCircle />);
      } else {
        showToast('info', 'Already in wishlist', <AlertCircle />);
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to add to wishlist', <XCircle />);
    }
  }

  async function proceedToCheckout() {
    if (!cart || !cart.items || cart.items.length === 0) {
      showToast('warning', 'Your cart is empty', <AlertCircle />);
      return;
    }
    
    console.log('Cart items:', cart.items);
    
    // For single item, go directly to that hotel's booking page
    if (cart.items.length === 1) {
      const item = cart.items[0];
      console.log('Navigating to booking for item:', item);
      
      if (!item.hotelId) {
        showToast('error', 'Invalid hotel information', <XCircle />);
        return;
      }
      
      const queryParams = new URLSearchParams();
      if (item.checkIn) queryParams.set('checkIn', item.checkIn);
      if (item.checkOut) queryParams.set('checkOut', item.checkOut);
      const url = `/booking/${item.hotelId}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      console.log('Navigation URL:', url);
      navigate(url);
    } else {
      // For multiple items, process first one
      showToast('info', 'Processing checkout...', <AlertCircle />);
      const firstItem = cart.items[0];
      
      if (!firstItem.hotelId) {
        showToast('error', 'Invalid hotel information', <XCircle />);
        return;
      }
      
      const queryParams = new URLSearchParams();
      if (firstItem.checkIn) queryParams.set('checkIn', firstItem.checkIn);
      if (firstItem.checkOut) queryParams.set('checkOut', firstItem.checkOut);
      const url = `/booking/${firstItem.hotelId}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      console.log('Navigation URL:', url);
      navigate(url);
    }
  }

  if (!isSignedIn) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 p-8">
          <div className="max-w-4xl mx-auto text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Sign in to view your cart</h2>
            <p className="text-gray-600">Save your bookings and checkout anytime</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const cartItems = cart?.items || [];
  const hasCartItems = cartItems.length > 0;
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <>
      <Navbar />
      {toast && <Toast type={toast.type} message={toast.message} icon={toast.icon} onClose={() => setToast(null)} />}
      <main className="min-h-screen bg-gray-50 pt-20 pb-12">
        {/* Header */}
        <div className="bg-gradient-to-b from-gray-900 to-black py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-4">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Your Cart</h1>
              <p className="text-xl text-white/90">
                {hasCartItems ? `${cartItems.length} ${cartItems.length === 1 ? 'item' : 'items'} in cart` : 'Your cart is empty'}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading your cart...</p>
            </div>
          ) : !hasCartItems ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-6">Add hotels to your cart to proceed with booking</p>
              <button 
                onClick={() => navigate('/hotels')} 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Browse Hotels
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Cart Items</h2>
                
                {cartItems.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="flex flex-col sm:flex-row gap-4 p-4">
                      {/* Hotel Image */}
                      <div 
                        onClick={() => item.hotelId && navigate(`/hotels/${item.hotelId}`)}
                        className="relative w-full sm:w-48 h-48 sm:h-32 overflow-hidden rounded-lg cursor-pointer group flex-shrink-0"
                      >
                        <img 
                          src={item.image || '/hotel-placeholder.jpg'} 
                          alt={item.hotelName}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </div>

                      {/* Hotel Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 
                            onClick={() => item.hotelId && navigate(`/hotels/${item.hotelId}`)}
                            className="font-bold text-lg text-gray-900 mb-1 hover:text-blue-600 cursor-pointer"
                          >
                            {item.hotelName || 'Hotel'}
                          </h3>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            {item.roomType && (
                              <p className="flex items-center gap-1">
                                <span>🛏️</span> {item.roomType}
                              </p>
                            )}
                            {item.guests && (
                              <p className="flex items-center gap-1">
                                <span>👥</span> {item.guests} {item.guests === 1 ? 'Guest' : 'Guests'}
                              </p>
                            )}
                            {item.checkIn && item.checkOut && (
                              <p className="flex items-center gap-1">
                                <span>📅</span> {new Date(item.checkIn).toLocaleDateString()} - {new Date(item.checkOut).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="text-2xl font-bold text-blue-600">
                            LKR {(item.price || 0).toLocaleString()}
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => item.hotelId && addToWishlist(item)}
                              className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                              title="Add to wishlist"
                            >
                              ❤️ Wishlist
                            </button>
                            <button
                              onClick={() => removeItem(idx)}
                              className="px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Items ({cartItems.length})</span>
                      <span>LKR {totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Service Fee</span>
                      <span>LKR 0</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-lg font-bold text-gray-900">
                        <span>Total</span>
                        <span className="text-blue-600">LKR {totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={proceedToCheckout}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    Proceed to Checkout
                  </button>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-800 text-center">
                      🔒 Secure checkout with encrypted payment
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recommended Hotels Section */}
          {recommendations.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                <h2 className="text-2xl font-bold text-gray-900">You Might Also Like</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendations.map((hotel) => (
                  <HotelCard key={hotel._id} hotel={hotel} showAddToCart={true} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
