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
