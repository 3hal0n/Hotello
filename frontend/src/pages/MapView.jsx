import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MapPin, Star, Navigation, Loader2, DollarSign } from 'lucide-react';
import { mockHotels } from '../data/mockHotels';

export default function MapView() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 7.8731, lng: 80.7718 }); // Sri Lanka center
  const [mapZoom, setMapZoom] = useState(8);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/hotels`);
        const data = await response.json();
        
        console.log('Map API Response:', data);
        
        let hotelsData = [];
        if (data.success && data.data) {
          hotelsData = data.data;
        } else if (Array.isArray(data)) {
          hotelsData = data;
        }
        
        setHotels(hotelsData);
        
        // Calculate center point of all hotels if available
        if (hotelsData.length > 0) {
          const hotelsWithGeo = hotelsData.filter(h => h.geo?.lat && h.geo?.lng);
          if (hotelsWithGeo.length > 0) {
            const avgLat = hotelsWithGeo.reduce((sum, h) => sum + h.geo.lat, 0) / hotelsWithGeo.length;
            const avgLng = hotelsWithGeo.reduce((sum, h) => sum + h.geo.lng, 0) / hotelsWithGeo.length;
            setMapCenter({ lat: avgLat, lng: avgLng });
          }
        }
      } catch (err) {
        console.error('Backend not available, using mock data:', err);
        setHotels(mockHotels);
        const hotelsWithGeo = mockHotels.filter(h => h.geo?.lat && h.geo?.lng);
        if (hotelsWithGeo.length > 0) {
          const avgLat = hotelsWithGeo.reduce((sum, h) => sum + h.geo.lat, 0) / hotelsWithGeo.length;
          const avgLng = hotelsWithGeo.reduce((sum, h) => sum + h.geo.lng, 0) / hotelsWithGeo.length;
          setMapCenter({ lat: avgLat, lng: avgLng });
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleHotelClick = (hotel) => {
    setSelectedHotel(hotel);
    if (hotel.geo?.lat && hotel.geo?.lng) {
      setMapCenter({ lat: hotel.geo.lat, lng: hotel.geo.lng });
      setMapZoom(15);
    }
  };

  const resetMapView = () => {
    setSelectedHotel(null);
    const hotelsWithGeo = hotels.filter(h => h.geo?.lat && h.geo?.lng);
    if (hotelsWithGeo.length > 0) {
      const avgLat = hotelsWithGeo.reduce((sum, h) => sum + h.geo.lat, 0) / hotelsWithGeo.length;
      const avgLng = hotelsWithGeo.reduce((sum, h) => sum + h.geo.lng, 0) / hotelsWithGeo.length;
      setMapCenter({ lat: avgLat, lng: avgLng });
      setMapZoom(8);
    }
  };

  const navigateToHotel = (hotelId) => {
    navigate(`/hotels/${hotelId}`);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
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
                Discover {hotels.filter(h => h.geo?.lat && h.geo?.lng).length} hotels across Sri Lanka
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Hotel List */}
              <div className="lg:col-span-1 space-y-3 max-h-[700px] overflow-y-auto bg-white rounded-lg shadow-sm p-4">
                <div className="sticky top-0 bg-white pb-3 border-b border-gray-200 mb-2">
                  <h2 className="text-xl font-bold text-gray-900">
                    Available Hotels ({hotels.length})
                  </h2>
                  {selectedHotel && (
                    <button
                      onClick={resetMapView}
                      className="mt-2 w-full px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-4 h-4" />
                      Show All Hotels
                    </button>
                  )}
                </div>

                {hotels.map((hotel, index) => {
                  const hasGeo = hotel.geo?.lat && hotel.geo?.lng;
                  const isSelected = selectedHotel?._id === hotel._id;
                  
                  return (
                    <div
                      key={hotel._id || index}
                      onClick={() => hasGeo && handleHotelClick(hotel)}
                      className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : hasGeo 
                            ? 'border-gray-200 hover:border-blue-300 hover:bg-gray-50' 
                            : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="relative flex-shrink-0">
                          <img
                            src={hotel.images?.[0] || '/hotel-placeholder.jpg'}
                            alt={hotel.name}
                            className="w-24 h-20 object-cover rounded-lg"
                          />
                          {!hasGeo && (
                            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                              <span className="text-white text-xs font-medium">No GPS</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate mb-1">{hotel.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{hotel.location}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">{hotel.rating || 0}</span>
                            </div>
                            <div className="text-sm font-bold text-blue-600">
                              LKR {(hotel.pricePerNight || hotel.price || 0).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Google Maps Embed - Clean iframe without pins */}
              <div className="lg:col-span-2 h-[700px] bg-white rounded-lg shadow-lg overflow-hidden relative">
                <iframe
                  title="Hotels Map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${mapCenter.lat},${mapCenter.lng}&zoom=${mapZoom}&maptype=roadmap`}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* Selected Hotel Info Card */}
                {selectedHotel && (
                  <div className="absolute bottom-6 left-6 right-6 bg-white rounded-xl shadow-2xl p-4 max-w-md border-2 border-blue-500">
                    <div className="flex gap-4">
                      <img
                        src={selectedHotel.images?.[0] || '/hotel-placeholder.jpg'}
                        alt={selectedHotel.name}
                        className="w-28 h-28 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">{selectedHotel.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{selectedHotel.location}</span>
                        </div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-medium text-sm">{selectedHotel.rating || 0}</span>
                          </div>
                          <div className="text-lg font-bold text-blue-600">
                            LKR {(selectedHotel.pricePerNight || selectedHotel.price || 0).toLocaleString()}/night
                          </div>
                        </div>
                        <button
                          onClick={() => navigateToHotel(selectedHotel._id)}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Info Banner */}
                <div className="absolute top-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-md p-3 max-w-md">
                  <p className="text-sm text-gray-700">
                    {selectedHotel ? (
                      <>
                        <span className="font-semibold">📍 Viewing:</span> {selectedHotel.name}
                      </>
                    ) : (
                      <>
                        <span className="font-semibold">💡 Tip:</span> Click any hotel from the list to view its location on the map
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
