import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const { getToken } = useAuth();

  async function submit(e) {
    e.preventDefault();
    const token = await getToken();
    const res = await fetch(`${import.meta.env.VITE_API_BASE || ''}/api/bookings`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ hotelId: id, checkIn, checkOut }),
    });
    const data = await res.json();
    if (res.ok) {
      navigate(`/bookings/${data.data._id}`);
    } else {
      alert(data.message || 'Booking failed');
    }
  }

  return (
    <main>
      <h1>Book Hotel</h1>
      <form onSubmit={submit}>
        <label>
          Check-in
          <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
        </label>
        <label>
          Check-out
          <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
        </label>
        <button type="submit">Book now</button>
      </form>
    </main>
  );
}
