import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HotelCard from '../components/HotelCard';
import Hero from '../components/Hero';
import HotelMap from '../components/HotelMap';

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
      <Navbar />
      
      {/* Spacer for fixed navbar */}
      <div className="h-10"></div>
      
      {/* New Hero Section with Carousel */}
      <Hero />

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
          <HotelMap />
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
