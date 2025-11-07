import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HotelCard from '../components/HotelCard';
import Pagination from '../components/Pagination';
import { Search, SlidersHorizontal, MapPin, Star, DollarSign, Wifi, Utensils, Car, Dumbbell, X, ChevronDown } from 'lucide-react';
import { mockHotels } from '../data/mockHotels';

export default function Hotels() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const hotelsPerPage = 9; // 3x3 grid like Home page

  // Filter states
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    priceRange: [0, 100000], // Increased max to 100,000 LKR
    rating: 0,
    amenities: [],
    sortBy: 'featured'
  });

  const amenitiesList = [
    { id: 'wifi', label: 'Free WiFi', icon: Wifi },
    { id: 'restaurant', label: 'Restaurant', icon: Utensils },
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'gym', label: 'Gym', icon: Dumbbell }
  ];

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    // Apply filters whenever filters change or hotels are loaded
    applyFilters();
  }, [filters, hotels]);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/hotels`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log('=== Hotels API Debug ===');
      console.log('API Response:', data);
      console.log('Response type:', typeof data);
      console.log('Has success property:', data.hasOwnProperty('success'));
      console.log('Has data property:', data.hasOwnProperty('data'));
      console.log('Is data an array?:', Array.isArray(data.data));
      console.log('Data length:', data.data?.length || 0);
      console.log('========================');
      
      // Handle API response structure
      if (data.success && data.data && Array.isArray(data.data)) {
        console.log('✅ Setting hotels from data.data:', data.data.length, 'hotels');
        setHotels(data.data);
        setFilteredHotels(data.data);
        if (data.data.length === 0) {
          setError('No hotels available in the database');
        }
      } else if (Array.isArray(data)) {
        console.log('✅ Setting hotels from direct array:', data.length, 'hotels');
        setHotels(data);
        setFilteredHotels(data);
      } else {
        console.error('❌ Invalid response structure:', data);
        setError('Invalid response from server');
        setHotels([]);
        setFilteredHotels([]);
      }
    } catch (error) {
      console.error('❌ Hotels fetch error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      setError(`Failed to load hotels: ${error.message}`);
      // Use mock data when backend is unavailable
      console.log('📦 Using mock data as fallback');
      setHotels(mockHotels);
      setFilteredHotels(mockHotels);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    // Don't filter if hotels aren't loaded yet
    if (!hotels || hotels.length === 0) {
      console.log('No hotels to filter');
      return;
    }

    console.log('Applying filters to', hotels.length, 'hotels');
    let result = [...hotels];

    // Search filter
    if (filters.search) {
      result = result.filter(hotel =>
        hotel.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        hotel.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Location filter
    if (filters.location) {
      result = result.filter(hotel =>
        hotel.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Price range filter
    result = result.filter(hotel => {
      const price = hotel.pricePerNight || hotel.price || 0;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Rating filter
    if (filters.rating > 0) {
      result = result.filter(hotel => hotel.rating >= filters.rating);
    }

    // Amenities filter
    if (filters.amenities.length > 0) {
      result = result.filter(hotel =>
        filters.amenities.every(amenity => hotel.amenities?.includes(amenity))
      );
    }
    // Sorting
    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.pricePerNight || a.price || 0) - (b.pricePerNight || b.price || 0));
        break;
      case 'price-high':
        result.sort((a, b) => (b.pricePerNight || b.price || 0) - (a.pricePerNight || a.price || 0));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // featured - no sorting needed
        break;
    }

    console.log('Filtered result:', result.length, 'hotels');
    setFilteredHotels(result);
    setCurrentPage(1); // Reset to page 1 when filters change
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleLocationChange = (e) => {
    setFilters({ ...filters, location: e.target.value });
  };

  const handlePriceRangeChange = (e, index) => {
    const newRange = [...filters.priceRange];
    newRange[index] = parseInt(e.target.value);
    setFilters({ ...filters, priceRange: newRange });
  };

  const handleRatingChange = (rating) => {
    setFilters({ ...filters, rating: filters.rating === rating ? 0 : rating });
  };

  const handleAmenityToggle = (amenityId) => {
    const newAmenities = filters.amenities.includes(amenityId)
      ? filters.amenities.filter(id => id !== amenityId)
      : [...filters.amenities, amenityId];
    setFilters({ ...filters, amenities: newAmenities });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      priceRange: [0, 100000],
      rating: 0,
      amenities: [],
      sortBy: 'featured'
    });
    setSearchParams({});
    setCurrentPage(1); // Reset to page 1
  };

  const activeFiltersCount = 
    (filters.location ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0) +
    filters.amenities.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000 ? 1 : 0);

  // Pagination calculations
  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel);
  const totalPages = Math.ceil(filteredHotels.length / hotelsPerPage);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Header Section */}
  <div className="bg-gradient-to-b from-gray-900 to-black py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
              Discover Your Perfect Stay
            </h1>
            <p className="text-xl text-white/90 text-center">
              {filteredHotels.length} hotels available
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white shadow-md sticky top-20 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={handleSearchChange}
                  placeholder="Search hotels..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="relative px-6 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 transition-colors flex items-center gap-2 font-semibold text-gray-700 hover:text-blue-600"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="px-6 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 transition-colors font-semibold text-gray-700 cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">
                    {error}
                  </p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={() => setError(null)}
                    className="inline-flex text-red-400 hover:text-red-600 focus:outline-none"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white border-b shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={filters.location}
                    onChange={handleLocationChange}
                    placeholder="Enter city..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Price Range
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={filters.priceRange[0]}
                      onChange={(e) => handlePriceRangeChange(e, 0)}
                      className="w-20 px-2 py-2 border border-gray-300 rounded-lg text-sm"
                      min="0"
                      max={filters.priceRange[1]}
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      value={filters.priceRange[1]}
                      onChange={(e) => handlePriceRangeChange(e, 1)}
                      className="w-20 px-2 py-2 border border-gray-300 rounded-lg text-sm"
                      min={filters.priceRange[0]}
                      max="100000"
                    />
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Star className="w-4 h-4 inline mr-1" />
                    Minimum Rating
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => handleRatingChange(rating)}
                        className={`p-2 rounded-lg transition-all ${
                          filters.rating >= rating
                            ? 'bg-yellow-400 text-white'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        <Star className="w-4 h-4" fill={filters.rating >= rating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Amenities
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {amenitiesList.map((amenity) => {
                      const Icon = amenity.icon;
                      return (
                        <button
                          key={amenity.id}
                          onClick={() => handleAmenityToggle(amenity.id)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                            filters.amenities.includes(amenity.id)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {amenity.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

    {/* Hotels Grid */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-12">
          {/* Results Summary */}
          {!loading && filteredHotels.length > 0 && (
            <div className="mb-6 text-center">
              <p className="text-gray-600">
                Showing {currentHotels.length > 0 ? indexOfFirstHotel + 1 : 0} - {Math.min(indexOfLastHotel, filteredHotels.length)} of {filteredHotels.length} hotels
              </p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>
          ) : filteredHotels.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No hotels found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or search criteria</p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
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
              {totalPages > 1 && (
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
