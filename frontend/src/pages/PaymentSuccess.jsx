import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useApi from '../hooks/useApi';
import { SignInButton } from '@clerk/clerk-react';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get('bookingId');
  const [status, setStatus] = useState('Checking...');
  const api = useApi();

  useEffect(() => {
    async function check() {
      try {
        if (!bookingId) {
          setStatus('No booking id provided');
          return;
        }

        // Try to fetch booking via protected endpoint. If the user token is not available
        // or the backend returns unauthorized, we'll show a sign-in prompt.
        const data = await api.fetchBookingById(bookingId);
        // Handle auth/middleware errors returned as { error: '...' }
        if (data && data.error) {
          setStatus('Please sign in to view booking details.');
          return;
        }
        if (data && data.success === false && (data.message === 'Unauthorized' || data.message === 'Unauthorized')) {
          setStatus('Please sign in to view booking details.');
          return;
        }
        if (data && data.success && data.data) {
          if (data.data.paymentStatus === 'paid') setStatus('Payment successful! Your booking is confirmed.');
          else setStatus('Payment received — please wait while we confirm your booking.');
        } else if (data && data.success === false) {
          setStatus(data.message || 'Booking not found');
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
          {status === 'Please sign in to view booking details.' && (
            <div className="mb-6 flex justify-center gap-3">
              <SignInButton mode="modal">
                <button className="px-4 py-2 bg-green-600 text-white rounded">Sign in</button>
              </SignInButton>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Retry
              </button>
            </div>
          )}
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
