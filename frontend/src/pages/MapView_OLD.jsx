import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MapPin, Star, DollarSign, Navigation, Loader2 } from 'lucide-react';
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
        const response = await fetch(`${import.meta.env.VITE_API_BASE || ''}/api/hotels`);
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
        // Calculate center for mock data
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
    // Recalculate center for all hotels
    const hotelsWithGeo = hotels.filter(h => h.geo?.lat && h.geo?.lng);
    if (hotelsWithGeo.length > 0) {
      const avgLat = hotelsWithGeo.reduce((sum, h) => sum + h.geo.lat, 0) / hotelsWithGeo.length;
      const avgLng = hotelsWithGeo.reduce((sum, h) => sum + h.geo.lng, 0) / hotelsWithGeo.length;
      setMapCenter({ lat: avgLat, lng: avgLng });
      setMapZoom(8);
    }
  };

  const navigateToHotel = (hotelId) => {
    navigate(`/hotel/${hotelId}`);
  };

  // Convert lat/lng to pixel position for overlay
  const getMarkerPosition = (hotel) => {
    if (!hotel.geo?.lat || !hotel.geo?.lng) return null;
    
    // Map bounds for Sri Lanka (approximate)
    const bounds = {
      north: 10.0,
      south: 5.9,
      east: 82.0,
      west: 79.5
    };
    
    // Calculate percentage position
    const x = ((hotel.geo.lng - bounds.west) / (bounds.east - bounds.west)) * 100;
    const y = ((bounds.north - hotel.geo.lat) / (bounds.north - bounds.south)) * 100;
    
    return { x: `${x}%`, y: `${y}%` };
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
                  {/* Map Controls */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white flex items-center justify-between">
                    <h2 className="text-xl font-bold">
                      {selectedHotel ? selectedHotel.name : `All Hotels (${hotels.length})`}
                    </h2>
                    {selectedHotel && (
                      <button
                        onClick={resetMapView}
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg font-semibold transition-colors text-sm"
                      >
                        Show All Hotels
                      </button>
                    )}
                  </div>

                  {selectedHotel ? (
                    <div>
                      {/* Selected Hotel Details */}
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <p className="flex items-center gap-2 text-white/90 mb-2">
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

                      {/* Single Hotel Map */}
                      <div className="h-[500px] bg-gray-200 relative">
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
                    /* All Hotels Map View */
                    <div>
                      <div className="h-[700px] bg-gray-200 relative overflow-hidden">
                        {hotels.filter(h => h.geo?.lat && h.geo?.lng).length > 0 ? (
                          <div className="relative w-full h-full">
                            {/* Google Maps Static API with all markers */}
                            <img
                              src={`https://maps.googleapis.com/maps/api/staticmap?center=${mapCenter.lat},${mapCenter.lng}&zoom=${mapZoom}&size=800x700&maptype=roadmap&${hotels.filter(h => h.geo?.lat && h.geo?.lng).map((h, i) => `markers=color:blue%7Clabel:${i + 1}%7C${h.geo.lat},${h.geo.lng}`).join('&')}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`}
                              alt="Hotels Map"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to iframe if static map fails
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                              }}
                            />
                            
                            {/* Fallback iframe (hidden by default) */}
                            <div style={{ display: 'none' }} className="w-full h-full">
                              <iframe
                                src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${mapCenter.lat},${mapCenter.lng}&zoom=${mapZoom}&maptype=roadmap`}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full h-full"
                              ></iframe>
                            </div>
                            
                            {/* Clickable overlay for hotel markers */}
                            <div className="absolute inset-0 pointer-events-none">
                              {hotels.filter(h => h.geo?.lat && h.geo?.lng).map((hotel, index) => {
                                const pos = getMarkerPosition(hotel);
                                if (!pos) return null;
                                
                                return (
                                  <div
                                    key={hotel._id}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
                                    style={{ left: pos.x, top: pos.y }}
                                    onClick={() => handleHotelClick(hotel)}
                                  >
                                    {/* Clickable area - larger than visible pin */}
                                    <div className="relative p-4">
                                      {/* Pin with number */}
                                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                        <div className="relative">
                                          <div className="absolute -inset-3 bg-blue-600 rounded-full opacity-0 group-hover:opacity-20 blur-md transition-opacity"></div>
                                          <div className="relative w-10 h-10 bg-blue-600 rounded-full border-3 border-white shadow-lg flex items-center justify-center group-hover:bg-blue-700 group-hover:scale-125 transition-all duration-200 z-10">
                                            <span className="text-white font-bold text-sm">{index + 1}</span>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {/* Hotel Name Tooltip */}
                                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                        <div className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-2xl">
                                          <div className="font-semibold">{hotel.name}</div>
                                          <div className="text-gray-300 text-xs mt-1">
                                            LKR {(hotel.pricePerNight || 0).toLocaleString()}/night • ⭐ {hotel.rating || 'N/A'}
                                          </div>
                                          {/* Arrow */}
                                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                                            <div className="w-3 h-3 bg-gray-900 transform rotate-45"></div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-center p-12">
                            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                              <MapPin className="w-12 h-12 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                              No Location Data Available
                            </h3>
                            <p className="text-gray-600 max-w-md">
                              Hotels don't have GPS coordinates yet. Click on any hotel to view available information.
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* Info Box */}
                      <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-t-4 border-blue-600">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <Navigation className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                              Interactive Hotel Map
                            </h3>
                            <p className="text-gray-700 mb-3">
                              All hotels are shown on the map with numbered markers. 
                              Hover over markers to see hotel details, or click to zoom in for more information.
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                                📍 {hotels.filter(h => h.geo?.lat && h.geo?.lng).length} Hotels with GPS
                              </span>
                              <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                                🏨 {hotels.length} Total Hotels
                              </span>
                              <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium shadow-sm">
                                🔵 Click numbered pins for details
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
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
