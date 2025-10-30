import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MapPin, Star, DollarSign, Navigation, Loader2 } from 'lucide-react';

export default function MapView() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE || ''}/api/hotels`);
        const data = await response.json();
        
        console.log('Map API Response:', data);
        
        if (data.success && data.data) {
          setHotels(data.data);
        } else if (Array.isArray(data)) {
          setHotels(data);
        } else {
          setHotels([]);
        }
      } catch (err) {
        console.error(err);
        setHotels([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleHotelClick = (hotel) => {
    setSelectedHotel(hotel);
  };

  const navigateToHotel = (hotelId) => {
    navigate(`/hotel/${hotelId}`);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-20">
        {/* Header */}
        <div className="bg-gradient-to-b from-gray-900 to-black py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-4">
                <Navigation className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Explore Hotels on Map
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Discover hotels in your desired location. Click on any hotel to view details.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600 text-lg">Loading hotel locations...</p>
            </div>
          ) : hotels.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Hotels Available</h3>
              <p className="text-gray-600">Please check back later for hotel locations.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Hotels List */}
              <div className="lg:col-span-1 space-y-4 max-h-[800px] overflow-y-auto pr-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 sticky top-0 bg-gray-50 py-2">
                  Available Hotels ({hotels.length})
                </h2>
                {hotels.map((hotel) => (
                  <div
                    key={hotel._id}
                    onClick={() => handleHotelClick(hotel)}
                    className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${
                      selectedHotel?._id === hotel._id
                        ? 'border-blue-600 ring-2 ring-blue-200'
                        : 'border-transparent hover:border-blue-300'
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={hotel.images?.[0] || '/placeholder-hotel.jpg'}
                          alt={hotel.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1 truncate">
                            {hotel.name}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{hotel.location || 'Location not specified'}</span>
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">
                                {hotel.rating || 'N/A'}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900">
                                LKR {(hotel.pricePerNight || hotel.price || 0).toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500">per night</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Display */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-24">
                  {selectedHotel ? (
                    <div>
                      {/* Selected Hotel Details */}
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-2">{selectedHotel.name}</h2>
                            <p className="flex items-center gap-2 text-white/90">
                              <MapPin className="w-5 h-5" />
                              {selectedHotel.location}
                            </p>
                          </div>
                          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                            <div className="flex items-center gap-1 text-white">
                              <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                              <span className="font-bold">{selectedHotel.rating || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-white/80">Starting from</p>
                            <p className="text-3xl font-bold">
                              LKR {(selectedHotel.pricePerNight || selectedHotel.price || 0).toLocaleString()}
                              <span className="text-base font-normal text-white/80">/night</span>
                            </p>
                          </div>
                          <button
                            onClick={() => navigateToHotel(selectedHotel._id)}
                            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </div>

                      {/* Google Maps Embed */}
                      <div className="h-[600px] bg-gray-200 relative">
                        {selectedHotel.geo?.lat && selectedHotel.geo?.lng ? (
                          <iframe
                            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${selectedHotel.geo.lat},${selectedHotel.geo.lng}&zoom=15`}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full h-full"
                          ></iframe>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-600 font-medium">
                                Location coordinates not available for this hotel
                              </p>
                              <p className="text-sm text-gray-500 mt-2">
                                {selectedHotel.location}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Hotel Image Gallery */}
                      {selectedHotel.images && selectedHotel.images.length > 0 && (
                        <div className="p-6 bg-gray-50">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hotel Images</h3>
                          <div className="grid grid-cols-3 gap-4">
                            {selectedHotel.images.slice(0, 6).map((image, idx) => (
                              <img
                                key={idx}
                                src={image}
                                alt={`${selectedHotel.name} ${idx + 1}`}
                                className="w-full h-32 object-cover rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                                onClick={() => navigateToHotel(selectedHotel._id)}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-[700px] flex flex-col items-center justify-center text-center p-12">
                      <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                        <MapPin className="w-12 h-12 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Select a Hotel to View on Map
                      </h3>
                      <p className="text-gray-600 max-w-md">
                        Click on any hotel from the list on the left to see its location on the map and explore nearby areas.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
