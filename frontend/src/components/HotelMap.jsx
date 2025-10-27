import React, { useEffect, useRef } from 'react';
import { useApi } from '../hooks/useApi';

// You can use Google Maps JS API or Mapbox. This is a simple Google Maps embed example.
export default function HotelMap() {
  const mapRef = useRef(null);
  const [hotels, setHotels] = React.useState([]);
  const { fetchHotels } = useApi();

  useEffect(() => {
    fetchHotels().then((data) => {
      if (data.success) setHotels(data.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only fetch once on mount

  useEffect(() => {
    if (window.google && hotels.length && mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: hotels[0]?.geo?.lat || 7.8731, lng: hotels[0]?.geo?.lng || 80.7718 },
        zoom: 7,
      });
      hotels.forEach((hotel) => {
        if (hotel.geo?.lat && hotel.geo?.lng) {
          new window.google.maps.Marker({
            position: { lat: hotel.geo.lat, lng: hotel.geo.lng },
            map,
            title: hotel.name,
          });
        }
      });
    }
  }, [hotels]);

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      {/* Make sure to load Google Maps JS API in your index.html */}
    </div>
  );
}
