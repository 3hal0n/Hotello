import React, { useEffect, useState } from 'react';
import DomeGallery from '../components/DomeGallery';
import TextPressure from '../components/TextPressure';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HotelCard from '../components/HotelCard';

export default function Home() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE || ''}/api/hotels`)
      .then((r) => r.json())
      .then((response) => {
        console.log('API Response:', response);
        // Backend returns { success: true, count: X, data: [...] }
        if (response.success && response.data) {
          setHotels(response.data);
        } else {
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

  // Create gallery images from hotels
  const galleryImages = hotels.map(hotel => ({
    src: hotel.images?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    alt: hotel.name
  }));

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-900">
        <div className="flex items-center justify-center h-screen">
          <p className="text-white text-xl">Loading your perfect stay...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-900">
        <div className="flex items-center justify-center h-screen">
          <p className="text-red-400 text-xl">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section - Dome Gallery */}
      <section className="relative w-full h-screen bg-white overflow-hidden">
        {/* Dome Gallery Layer - Auto-rotating */}
        <div className="absolute inset-0 z-10">
          <DomeGallery 
            images={galleryImages}
            grayscale={false}
            overlayBlurColor="#ffffff"
            fit={1}
            minRadius={800}
            segments={40}
            autoRotate={true}
            autoRotateSpeed={0.5}
          />
        </div>
        
        {/* Hero Text Overlay with TextPressure */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 px-4">
          <div className="w-full max-w-5xl h-32 mb-6">
            <TextPressure
              text="Hotello"
              textColor="#1f2937"
              minFontSize={32}
              width={true}
              weight={true}
              italic={false}
              alpha={false}
              flex={false}
              stroke={false}
            />
          </div>
          <p className="text-xl md:text-2xl text-gray-700 drop-shadow-lg font-light">
            Find Your Perfect Stay
          </p>
        </div>
      </section>

      {/* Hotels Grid Section */}
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
          
          {hotels.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No hotels available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotels.map((hotel) => (
                <HotelCard key={hotel._id} hotel={hotel} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
