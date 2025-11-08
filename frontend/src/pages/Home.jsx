import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HotelCard from '../components/HotelCard';
import Hero from '../components/Hero';
import HotelMap from '../components/HotelMap';
import AdminLayout from './AdminLayout';
import FeaturesSection from '../components/FeaturesSection';
import Pagination from '../components/Pagination';
import { AIChatbot } from '../components/AIChatbot';
import { Sparkles, MapPin, Filter, Star, Quote } from 'lucide-react';
import { mockHotels } from '../data/mockHotels';

export default function Home() {
  const [allHotels, setAllHotels] = useState([]); // Store all hotels
  const [hotels, setHotels] = useState([]); // Display hotels
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [AdminLoginComp, setAdminLoginComp] = useState(null);
  const [AdminDashboardComp, setAdminDashboardComp] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const hotelsPerPage = 9;
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [rating, setRating] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE || ''}/api/hotels`)
      .then((r) => r.json())
      .then((response) => {
        console.log('API Response:', response);
        if (response.success && response.data) {
          setAllHotels(response.data);
          setHotels(response.data);
        } else {
          setAllHotels([]);
          setHotels([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Backend not available, using mock data:', err);
        // Use mock data when backend is unavailable
        setAllHotels(mockHotels);
        setHotels(mockHotels);
        setError(null); // Don't show error when using mock data
        setLoading(false);
      });
  }, []);

  // Filter and sort hotels
  useEffect(() => {
    let filtered = [...allHotels];

    // Enhanced search filter with emotion keywords
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const keywords = query.split(' ').filter(k => k.length > 2); // Split into keywords
      
      filtered = filtered.filter(h => {
        const searchableText = [
          h.name,
          h.location,
          h.description || '',
          ...(h.amenities || []),
          h.policies || ''
        ].join(' ').toLowerCase();
        
        // Check if any keyword matches
        return keywords.some(keyword => searchableText.includes(keyword)) ||
               searchableText.includes(query);
      });
    }

    // Price filter
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(v => v === '+' ? Infinity : parseInt(v));
      filtered = filtered.filter(h => h.pricePerNight >= min && h.pricePerNight <= max);
    }

    // Rating filter
    if (rating) {
      const minRating = parseFloat(rating);
      filtered = filtered.filter(h => h.rating >= minRating);
    }

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    setHotels(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, priceRange, rating, sortBy, allHotels]);

  // Handle emotion search from Hero
  const handleEmotionSearch = (emotionQuery) => {
    setSearchQuery(emotionQuery);
  };

  // Pagination logic
  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = hotels.slice(indexOfFirstHotel, indexOfLastHotel);
  const totalPages = Math.ceil(hotels.length / hotelsPerPage);

  async function handleAdminLogin(token, admin) {
    setIsAdmin(true);
    setShowAdminLogin(false);
    if (!AdminDashboardComp) {
      const mod = await import('./AdminDashboard.jsx');
      setAdminDashboardComp(() => mod.default);
    }
  }

  function handleAdminLogout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAdmin(false);
  }

  async function openAdminLogin() {
    setShowAdminLogin(true);
    if (!AdminLoginComp) {
      const mod = await import('../components/AdminLogin.jsx');
      setAdminLoginComp(() => mod.default);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-900">
          <div className="flex items-center justify-center h-screen">
            <p className="text-white text-xl">Loading your perfect stay...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-900">
          <div className="flex items-center justify-center h-screen">
            <p className="text-red-400 text-xl">{error}</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {!isAdmin ? (
        <>
          <Navbar />
          <Hero onEmotionSearch={handleEmotionSearch} />
          <section id="hotels-section" className="bg-gradient-to-b from-gray-50 to-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Our Premium Hotels
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Explore our handpicked selection of luxury hotels across Sri Lanka's most beautiful destinations
                </p>
              </div>

              {/* Enhanced Search and Filter Section with AI Emotion */}
              <div className="mb-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Filter className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Search & Filter</h3>
                  </div>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setPriceRange('');
                      setRating('');
                      setSortBy('featured');
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear All
                  </button>
                </div>

                {/* AI Emotion Quick Search */}
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <h4 className="text-sm font-semibold text-gray-900">AI Emotion-Driven Search</h4>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">Find hotels that match your mood and preferences</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { emoji: "😌", label: "Relaxing", query: "peaceful relaxing spa wellness quiet serene" },
                      { emoji: "🎉", label: "Exciting", query: "vibrant nightlife entertainment activities adventure" },
                      { emoji: "💑", label: "Romantic", query: "romantic couples intimate cozy candlelit" },
                      { emoji: "👨‍👩‍👧‍👦", label: "Family", query: "family kids children playground activities pool" },
                      { emoji: "💼", label: "Business", query: "business conference meeting workspace professional" },
                      { emoji: "🏖️", label: "Beach", query: "beach ocean seaside coastal beachfront" },
                    ].map((emotion) => (
                      <button
                        key={emotion.label}
                        onClick={() => setSearchQuery(emotion.query)}
                        className="group px-4 py-2 rounded-full bg-white border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all hover:scale-105 shadow-sm"
                      >
                        <span className="text-lg mr-1">{emotion.emoji}</span>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                          {emotion.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Traditional Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* Search Input */}
                  <div className="lg:col-span-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search hotels, locations, or describe your mood..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Price Filter */}
                  <div>
                    <select 
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                    >
                      <option value="">All Prices</option>
                      <option value="0-10000">Under $100</option>
                      <option value="10000-20000">$100 - $200</option>
                      <option value="20000-30000">$200 - $300</option>
                      <option value="30000+">$300+</option>
                    </select>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <select 
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                    >
                      <option value="">Any Rating</option>
                      <option value="4">4+ Stars</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="4.8">4.8+ Stars</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>
                </div>
                
                {/* Active Filters Summary */}
                {(searchQuery || priceRange || rating || sortBy !== 'featured') && (
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-600">Active filters:</span>
                    {searchQuery && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        Search: {searchQuery}
                        <button onClick={() => setSearchQuery('')} className="hover:text-blue-900">✕</button>
                      </span>
                    )}
                    {priceRange && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        Price: {priceRange}
                        <button onClick={() => setPriceRange('')} className="hover:text-green-900">✕</button>
                      </span>
                    )}
                    {rating && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                        Rating: {rating}+
                        <button onClick={() => setRating('')} className="hover:text-yellow-900">✕</button>
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setPriceRange('');
                        setRating('');
                        setSortBy('featured');
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>
              
              {/* Results Summary */}
              <div className="mb-6 text-center">
                <p className="text-gray-600">
                  Showing {currentHotels.length > 0 ? indexOfFirstHotel + 1 : 0} - {Math.min(indexOfLastHotel, hotels.length)} of {hotels.length} hotels
                </p>
              </div>

              {/* Hotels Grid */}
              {hotels.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mb-4">
                    <Sparkles className="w-16 h-16 text-gray-300 mx-auto" />
                  </div>
                  <p className="text-xl text-gray-600 mb-2">No hotels match your criteria</p>
                  <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setPriceRange('');
                      setRating('');
                      setSortBy('featured');
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentHotels.map((hotel) => (
                      <HotelCard key={hotel._id} hotel={hotel} />
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
            </div>
          </section>

          {/* Features Section */}
          <FeaturesSection />

          {/* Popular Cities Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Popular Destinations
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Discover amazing hotels across Sri Lanka's most beautiful cities
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { 
                    city: 'Colombo', 
                    hotels: 5, 
                    image: '/assets/img/colombo.png',
                    description: 'Vibrant capital city'
                  },
                  { 
                    city: 'Kandy', 
                    hotels: 3, 
                    image: '/assets/img/kandy.png',
                    description: 'Cultural heart of Sri Lanka'
                  },
                  { 
                    city: 'Galle', 
                    hotels: 2, 
                    image: '/assets/img/galle.png',
                    description: 'Historic coastal city'
                  },
                  { 
                    city: 'Nuwara Eliya', 
                    hotels: 3, 
                    image: '/assets/img/nuwaraEliye.png',
                    description: 'Little England of Sri Lanka'
                  },
                  { 
                    city: 'Bentota', 
                    hotels: 2, 
                    image: '/assets/img/bentota.png',
                    description: 'Beach paradise'
                  },
                  { 
                    city: 'Sigiriya', 
                    hotels: 2, 
                    image: '/assets/img/sigiriya.png',
                    description: 'Ancient rock fortress'
                  },
                  { 
                    city: 'Dambulla', 
                    hotels: 1, 
                    image: '/assets/img/dambulla.png',
                    description: 'Cave temples & nature'
                  },
                  { 
                    city: 'Tangalle', 
                    hotels: 2, 
                    image: '/assets/img/tangalle.png',
                    description: 'Serene beach retreat'
                  },
                ].map((destination, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                  >
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={destination.image}
                        alt={destination.city}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-1 group-hover:text-blue-300 transition-colors">
                        {destination.city}
                      </h3>
                      <p className="text-sm text-gray-300 mb-2">{destination.description}</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-semibold text-blue-300">
                          {destination.hotels} Hotels Available
                        </span>
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 border-4 border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Customer Reviews Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  What Our Guests Say
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Real experiences from real travelers who found their perfect stay with Hotello
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    name: 'Sarah Johnson',
                    location: 'New York, USA',
                    image: 'https://randomuser.me/api/portraits/women/32.jpg',
                    rating: 5,
                    review: 'The AI emotion search helped me find the perfect romantic getaway in Kandy. The hotel exceeded all our expectations!',
                    hotel: 'Earls Regency, Kandy',
                    date: 'October 2024'
                  },
                  {
                    name: 'Michael Chen',
                    location: 'Singapore',
                    image: 'https://randomuser.me/api/portraits/men/45.jpg',
                    rating: 5,
                    review: 'Booking was seamless, and the AI chatbot answered all my questions instantly. Found an amazing beach resort in Bentota!',
                    hotel: 'Avani Bentota Resort',
                    date: 'September 2024'
                  },
                  {
                    name: 'Emma Williams',
                    location: 'London, UK',
                    image: 'https://randomuser.me/api/portraits/women/68.jpg',
                    rating: 5,
                    review: 'The family-friendly search was a game-changer! We found the perfect hotel with activities for our kids in Colombo.',
                    hotel: 'Cinnamon Grand Colombo',
                    date: 'November 2024'
                  },
                ].map((review, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:-translate-y-2"
                  >
                    {/* Quote Icon */}
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 relative">
                      <Quote className="w-10 h-10 text-white/30 absolute top-4 right-4" />
                      <div className="flex items-center gap-4">
                        <img
                          src={review.image}
                          alt={review.name}
                          className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                        />
                        <div className="text-white">
                          <h4 className="font-bold text-lg">{review.name}</h4>
                          <p className="text-sm text-blue-100">{review.location}</p>
                        </div>
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className="p-6">
                      {/* Star Rating */}
                      <div className="flex gap-1 mb-4">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>

                      {/* Review Text */}
                      <p className="text-gray-700 leading-relaxed mb-4 italic">
                        "{review.review}"
                      </p>

                      {/* Hotel Info */}
                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{review.hotel}</p>
                        <p className="text-xs text-gray-500 mt-1">{review.date}</p>
                      </div>
                    </div>

                    {/* Bottom Accent */}
                    <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500" />
                  </div>
                ))}
              </div>

              {/* Trust Indicators */}
              <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className="p-6 bg-white rounded-xl shadow-md">
                  <div className="text-4xl font-bold text-blue-600 mb-2">4.9/5</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-md">
                  <div className="text-4xl font-bold text-blue-600 mb-2">5,000+</div>
                  <div className="text-sm text-gray-600">Happy Guests</div>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-md">
                  <div className="text-4xl font-bold text-blue-600 mb-2">20+</div>
                  <div className="text-sm text-gray-600">Premium Hotels</div>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-md">
                  <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
                  <div className="text-sm text-gray-600">AI Support</div>
                </div>
              </div>
            </div>
          </section>

          {/* Admin Login Button at bottom */}
          <div className="flex justify-center my-10">
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow"
              onClick={openAdminLogin}
            >
              Admin Login
            </button>
          </div>
          {/* Admin Login Modal */}
          {showAdminLogin && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                <button
                  className="absolute top-2 right-4 text-gray-400 text-xl"
                  onClick={() => setShowAdminLogin(false)}
                >×</button>
                <React.Suspense fallback={<div>Loading...</div>}>
                  {AdminLoginComp ? <AdminLoginComp onLogin={handleAdminLogin} /> : null}
                </React.Suspense>
              </div>
            </div>
          )}
          
          {/* AI Chatbot */}
          <AIChatbot />
          
          <Footer />
        </>
      ) : (
        <React.Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div></div>}>
          {AdminDashboardComp ? (
            <AdminDashboardComp 
              adminToken={localStorage.getItem('adminToken')} 
              adminUser={JSON.parse(localStorage.getItem('adminUser') || '{}')}
              onLogout={handleAdminLogout}
            />
          ) : null}
        </React.Suspense>
      )}
    </div>
  );
}
