import { useAuth } from '@clerk/clerk-react';
import { useCallback } from 'react';

export default function useApi() {
  const { getToken } = useAuth();
  const base = import.meta.env.VITE_API_BASE ?? '';

  async function authHeaders() {
    const token = await getToken();
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  // User endpoints
  const fetchUsers = useCallback(async () => {
    const res = await fetch(`${base}/api/users`, { headers: await authHeaders() });
    return res.json();
  }, [base]);

  // Hotel endpoints
  const fetchHotels = useCallback(async () => {
    const res = await fetch(`${base}/api/hotels`);
    return res.json();
  }, [base]);
  
  const fetchHotelById = useCallback(async (id) => {
    const res = await fetch(`${base}/api/hotels/${id}`);
    return res.json();
  }, [base]);

  // Booking endpoints
  const createBooking = useCallback(async (data) => {
    const res = await fetch(`${base}/api/bookings`, {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  }, [base]);
  
  const fetchBookings = useCallback(async () => {
    const res = await fetch(`${base}/api/bookings`, { headers: await authHeaders() });
    return res.json();
  }, [base]);

  // Cart endpoints
  const fetchCart = useCallback(async () => {
    const res = await fetch(`${base}/api/cart`, { headers: await authHeaders() });
    return res.json();
  }, [base]);
  
  const updateCart = useCallback(async (data) => {
    const res = await fetch(`${base}/api/cart`, {
      method: 'PUT',
      headers: await authHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  }, [base]);

  // Wishlist endpoints
  const fetchWishlist = useCallback(async () => {
    const res = await fetch(`${base}/api/wishlist`, { headers: await authHeaders() });
    return res.json();
  }, [base]);
  
  const updateWishlist = useCallback(async (data) => {
    const res = await fetch(`${base}/api/wishlist`, {
      method: 'PUT',
      headers: await authHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  }, [base]);

  // Stripe payment
  const createPaymentSession = useCallback(async (data) => {
    const res = await fetch(`${base}/api/payments/session`, {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  }, [base]);

  // AI Chatbot
  const sendChatMessage = useCallback(async (message) => {
    const res = await fetch(`${base}/api/chat`, {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({ message })
    });
    return res.json();
  }, [base]);

  // Recommendations
  const fetchRecommendations = useCallback(async (query) => {
    const res = await fetch(`${base}/api/recommendations`, {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({ query })
    });
    return res.json();
  }, [base]);

  return {
    fetchUsers,
    fetchHotels,
    fetchHotelById,
    createBooking,
    fetchBookings,
    fetchCart,
    updateCart,
    fetchWishlist,
    updateWishlist,
    createPaymentSession,
    sendChatMessage,
    fetchRecommendations
  };
}

export { useApi };