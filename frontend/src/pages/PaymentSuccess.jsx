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
          if (data.data.paymentStatus === 'paid') {
            setStatus('🎉 Payment Complete! Hotel Booked Successfully! Your booking is confirmed and ready.');
          } else {
            // Show success message immediately since Stripe redirected here
            setStatus('🎉 Payment Complete! Hotel Booked Successfully! Your reservation has been confirmed.');
            // Start polling to update status once webhook processes
            let attempts = 0;
            const maxAttempts = 5; // ~15s of polling
            const interval = setInterval(async () => {
              attempts += 1;
              try {
                const polled = await api.fetchBookingById(bookingId);
                if (polled && polled.success && polled.data && polled.data.paymentStatus === 'paid') {
                  setStatus('🎉 Payment Complete! Hotel Booked Successfully! Your booking is confirmed and ready.');
                  clearInterval(interval);
                } else if (attempts >= maxAttempts) {
                  clearInterval(interval);
                }
              } catch (err) {
                console.error('Polling booking status error:', err);
                if (attempts >= maxAttempts) clearInterval(interval);
              }
            }, 3000);
          }
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
      <main className="min-h-screen pt-20 p-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-3xl mx-auto text-center bg-white rounded-2xl p-10 shadow-2xl">
          <div className="mb-6">
            {status.includes('🎉') && (
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Payment Status</h1>
          <p className="text-lg mb-8 text-gray-700">{status}</p>
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
