import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get('bookingId');
  const [status, setStatus] = useState('Checking...');

  useEffect(() => {
    async function check() {
      try {
        // Fetch booking details to verify paymentStatus
        const res = await fetch(`${import.meta.env.VITE_API_BASE || ''}/api/bookings/${bookingId}`);
        const data = await res.json();
        if (res.ok && data.data) {
          if (data.data.paymentStatus === 'paid') setStatus('Payment successful! Your booking is confirmed.');
          else setStatus('Payment received — please wait while we confirm your booking.');
        } else {
          setStatus('Booking not found');
        }
      } catch (err) {
        console.error(err);
        setStatus('Unable to verify booking status.');
      }
    }
    if (bookingId) check();
  }, [bookingId]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 p-8">
        <div className="max-w-3xl mx-auto text-center bg-white rounded-lg p-8 shadow">
          <h1 className="text-2xl font-bold mb-4">Payment Status</h1>
          <p className="mb-6">{status}</p>
          <div className="flex justify-center gap-4">
            <button onClick={() => navigate('/profile')} className="px-4 py-2 bg-blue-600 text-white rounded">Go to Profile</button>
            <button onClick={() => navigate('/hotels')} className="px-4 py-2 bg-gray-200 rounded">Browse Hotels</button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
