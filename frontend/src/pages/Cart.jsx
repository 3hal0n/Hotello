import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useApi from '../hooks/useApi';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const api = useApi();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) return;
    fetchCart();
  }, [isSignedIn]);

  async function fetchCart() {
    try {
      setLoading(true);
      const res = await api.fetchCart();
      if (res && res.success) setCart(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function removeItem(index) {
    const items = (cart && cart.items) ? [...cart.items] : [];
    items.splice(index, 1);
    await api.updateCart({ items });
    fetchCart();
  }

  if (!isSignedIn) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 p-8">
          <div className="max-w-4xl mx-auto text-center">
            <p>Please sign in to view your cart.</p>
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
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
          {loading ? (
            <p>Loading...</p>
          ) : (!cart || !cart.items || cart.items.length === 0) ? (
            <div className="bg-white rounded-lg p-8 shadow text-center">
              <p>Your cart is empty.</p>
              <button onClick={() => navigate('/hotels')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Browse Hotels</button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((it, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
                  <img src={it.image || '/hotel1.jpg'} alt="hotel" className="w-28 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{it.hotelName || 'Hotel'}</h3>
                    <p className="text-sm text-gray-600">{it.roomType || ''}</p>
                    <p className="text-sm text-gray-600">Guests: {it.guests}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${it.price}</div>
                    <button onClick={() => removeItem(idx)} className="mt-2 text-sm text-red-600">Remove</button>
                  </div>
                </div>
              ))}

              <div className="text-right">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg" onClick={() => alert('Proceed to checkout flow in Booking page')}>Proceed to Checkout</button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
