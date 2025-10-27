import { useAuth } from '@clerk/clerk-react';

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
  async function fetchUsers() {
    const res = await fetch(`${base}/api/users`, { headers: await authHeaders() });
    return res.json();
  }

  // Hotel endpoints
  async function fetchHotels() {
    const res = await fetch(`${base}/api/hotels`);
    return res.json();
  }
  async function fetchHotelById(id) {
    const res = await fetch(`${base}/api/hotels/${id}`);
    return res.json();
  }

  // Booking endpoints
  async function createBooking(data) {
    const res = await fetch(`${base}/api/bookings`, {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  }
  async function fetchBookings() {
    const res = await fetch(`${base}/api/bookings`, { headers: await authHeaders() });
    return res.json();
  }

  // Cart endpoints
  async function fetchCart() {
    const res = await fetch(`${base}/api/cart`, { headers: await authHeaders() });
    return res.json();
  }
  async function updateCart(data) {
    const res = await fetch(`${base}/api/cart`, {
      method: 'PUT',
      headers: await authHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  }

  // Wishlist endpoints
  async function fetchWishlist() {
    const res = await fetch(`${base}/api/wishlist`, { headers: await authHeaders() });
    return res.json();
  }
  async function updateWishlist(data) {
    const res = await fetch(`${base}/api/wishlist`, {
      method: 'PUT',
      headers: await authHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  }

  // Stripe payment
  async function createPaymentSession(data) {
    const res = await fetch(`${base}/api/payments/session`, {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  }

  // AI Chatbot
  async function sendChatMessage(message) {
    const res = await fetch(`${base}/api/chat`, {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({ message })
    });
    return res.json();
  }

  // Recommendations
  async function fetchRecommendations(query) {
    const res = await fetch(`${base}/api/recommendations`, {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({ query })
    });
    return res.json();
  }

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