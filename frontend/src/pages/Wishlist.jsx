import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useApi from '../hooks/useApi';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export default function Wishlist() {
  const api = useApi();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) return;
    fetchWishlist();
  }, [isSignedIn]);

  async function fetchWishlist() {
    try {
      setLoading(true);
      const res = await api.fetchWishlist();
      if (res && res.success) setWishlist(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function removeHotel(id) {
    const hotels = (wishlist && wishlist.hotels) ? wishlist.hotels.map(h => (typeof h === 'string' ? h : h._id)) : [];
    const idx = hotels.indexOf(id);
    if (idx > -1) hotels.splice(idx, 1);
    await api.updateWishlist({ hotels });
    fetchWishlist();
  }

  if (!isSignedIn) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 p-8">
          <div className="max-w-4xl mx-auto text-center">
            <p>Please sign in to view your wishlist.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>
          {loading ? (
            <p>Loading...</p>
          ) : (!wishlist || !wishlist.hotels || wishlist.hotels.length === 0) ? (
            <div className="bg-white rounded-lg p-8 shadow text-center">
              <p>Your wishlist is empty.</p>
              <button onClick={() => navigate('/hotels')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Browse Hotels</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wishlist.hotels.map((h) => (
                <div key={typeof h === 'string' ? h : h._id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center gap-4">
                    <img src={(h && h.image) || '/hotel1.jpg'} alt="hotel" className="w-28 h-20 object-cover rounded" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{h.name || 'Hotel'}</h3>
                      <p className="text-sm text-gray-600">{h.location}</p>
                    </div>
                    <div className="text-right">
                      <button onClick={() => removeHotel(h._id || h)} className="text-sm text-red-600">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
