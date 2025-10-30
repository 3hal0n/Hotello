import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HotelCard from '../components/HotelCard';
import Hero from '../components/Hero';
import HotelMap from '../components/HotelMap';
import AdminLayout from './AdminLayout';

export default function Home() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [AdminLoginComp, setAdminLoginComp] = useState(null);
  const [AdminDashboardComp, setAdminDashboardComp] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE || ''}/api/hotels`)
      .then((r) => r.json())
      .then((response) => {
        console.log('API Response:', response);
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
          <Hero />
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

              {/* Search and Filter Section */}
              <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  {/* Search Input */}
                  <div className="flex-1 w-full">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search hotels by name or location..."
                        className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onChange={(e) => {
                          const query = e.target.value.toLowerCase();
                          if (query === '') {
                            setHotels(hotels);
                          } else {
                            const filtered = hotels.filter(h => 
                              h.name.toLowerCase().includes(query) || 
                              h.location.toLowerCase().includes(query)
                            );
                            setHotels(filtered);
                          }
                        }}
                      />
                      <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Price Filter */}
                  <div className="w-full md:w-48">
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Price Range</option>
                      <option value="0-100">$0 - $100</option>
                      <option value="100-200">$100 - $200</option>
                      <option value="200-500">$200 - $500</option>
                      <option value="500+">$500+</option>
                    </select>
                  </div>

                  {/* Rating Filter */}
                  <div className="w-full md:w-48">
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Any Rating</option>
                      <option value="4">4+ Stars</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="4.8">4.8+ Stars</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div className="w-full md:w-48">
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>
                </div>
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
