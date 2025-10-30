import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HotelCard from '../components/HotelCard';
import Hero from '../components/Hero';
import HotelMap from '../components/HotelMap';
import AdminLayout from './AdminLayout';
import FeaturesSection from '../components/FeaturesSection';
import Pagination from '../components/Pagination';
import { Sparkles, MapPin, Filter } from 'lucide-react';

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
        console.error(err);
        setError('Failed to connect to server');
        setLoading(false);
      });
  }, []);

  // Filter and sort hotels
  useEffect(() => {
    let filtered = [...allHotels];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(h => 
        h.name.toLowerCase().includes(query) || 
        h.location.toLowerCase().includes(query) ||
        h.description?.toLowerCase().includes(query)
      );
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

  async function handleAdminLogin() {
    setIsAdmin(true);
    setShowAdminLogin(false);
    if (!AdminDashboardComp) {
      const mod = await import('./AdminDashboard.jsx');
      setAdminDashboardComp(() => mod.default);
    }
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
          <div className="h-10"></div>
          <Hero onEmotionSearch={handleEmotionSearch} />
          <section className="bg-gradient-to-b from-gray-50 to-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Our Premium Hotels
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Explore our handpicked selection of luxury hotels across Sri Lanka's most beautiful destinations
                </p>
              </div>

              {/* Enhanced Search and Filter Section */}
              <div className="mb-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <Filter className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Search & Filter</h3>
                </div>
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
          <Footer />
        </>
      ) : (
        <AdminLayout />
      )}
    </div>
  );
}
