import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HotelCard from '../components/HotelCard';
import useApi from '../hooks/useApi';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Heart, Loader2, ShoppingCart, Sparkles } from 'lucide-react';

export default function Wishlist() {
  const api = useApi();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (!isSignedIn) return;
    fetchWishlist();
    fetchRecommendations();
  }, [isSignedIn]);

  async function fetchWishlist() {
    try {
      setLoading(true);
      const res = await api.fetchWishlist();
      if (res && res.success) setWishlist(res.data);
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

  async function removeHotel(id) {
    const hotels = (wishlist && wishlist.hotels) ? wishlist.hotels.map(h => (typeof h === 'string' ? h : h._id)) : [];
    const idx = hotels.indexOf(id);
    if (idx > -1) hotels.splice(idx, 1);
    await api.updateWishlist({ hotels });
    fetchWishlist();
  }

  async function addToCart(hotel) {
    try {
      await api.addToCart({
        hotelId: hotel._id,
        hotelName: hotel.name,
        image: hotel.images?.[0],
        price: hotel.pricePerNight || hotel.price,
        roomType: 'Standard Room',
        guests: 2
      });
      alert('Added to cart!');
    } catch (err) {
      console.error(err);
      alert('Failed to add to cart');
    }
  }

  if (!isSignedIn) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 p-8">
          <div className="max-w-4xl mx-auto text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Sign in to view your wishlist</h2>
            <p className="text-gray-600">Save your favorite hotels and access them anytime</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const wishlistHotels = wishlist?.hotels || [];
  const hasWishlistItems = wishlistHotels.length > 0;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-20 pb-12">
        {/* Header */}
        <div className="bg-gradient-to-b from-gray-900 to-black py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-4">
                <Heart className="w-8 h-8 text-white fill-current" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Your Wishlist</h1>
              <p className="text-xl text-white/90">
                {hasWishlistItems ? `${wishlistHotels.length} saved hotels` : 'No saved hotels yet'}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading your wishlist...</p>
            </div>
          ) : !hasWishlistItems ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-6">Start adding hotels you love!</p>
              <button 
                onClick={() => navigate('/hotels')} 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Browse Hotels
              </button>
            </div>
          ) : (
            <>
              {/* Wishlist Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {wishlistHotels.map((h) => {
                  const hotel = typeof h === 'string' ? { _id: h, name: 'Hotel', location: 'Unknown' } : h;
                  return (
                    <div 
                      key={hotel._id} 
                      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                    >
                      {/* Hotel Image */}
                      <div 
                        onClick={() => navigate(`/hotels/${hotel._id}`)}
                        className="relative h-48 overflow-hidden cursor-pointer"
                      >
                        <img 
                          src={hotel.images?.[0] || '/hotel-placeholder.jpg'} 
                          alt={hotel.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        
                        {/* Remove from Wishlist Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeHotel(hotel._id);
                          }}
                          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-red-50 transition"
                          title="Remove from wishlist"
                        >
                          <Heart className="w-5 h-5 text-red-500 fill-current" />
                        </button>

                        {/* Rating Badge */}
                        {hotel.rating && (
                          <div className="absolute bottom-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm font-semibold">{hotel.rating}</span>
                          </div>
                        )}
                      </div>

                      {/* Hotel Info */}
                      <div className="p-4">
                        <h3 
                          onClick={() => navigate(`/hotels/${hotel._id}`)}
                          className="font-bold text-lg text-gray-900 mb-1 hover:text-blue-600 cursor-pointer truncate"
                        >
                          {hotel.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                          <span>📍</span> {hotel.location}
                        </p>

                        {/* Amenities */}
                        {hotel.amenities && hotel.amenities.length > 0 && (
                          <div className="flex gap-2 mb-3 flex-wrap">
                            {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                              <span key={idx} className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700">
                                {amenity}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Price and Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div>
                            <div className="text-sm text-gray-500">From</div>
                            <div className="text-xl font-bold text-blue-600">
                              LKR {((hotel.pricePerNight || hotel.price || 0)).toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">per night</div>
                          </div>
                          
                          <button
                            onClick={() => addToCart(hotel)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm font-medium"
                            title="Add to cart"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
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
                  <HotelCard key={hotel._id} hotel={hotel} showAddToWishlist={true} />
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
