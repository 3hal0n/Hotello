import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE || ''}/api/hotels`)
      .then((r) => r.json())
      .then((data) => setHotels(data.data || []))
      .catch(console.error);
  }, []);

  return (
    <main>
      <h1>Hotels</h1>
      <div>
        {hotels.map((h) => (
          <div key={h._id} style={{ border: '1px solid #ddd', padding: 12, margin: 8 }}>
            <h2>{h.name}</h2>
            <p>{h.location}</p>
            <p>Price per night: {h.pricePerNight}</p>
            <Link to={`/hotels/${h._id}`}>See details</Link>
          </div>
        ))}
      </div>
    </main>
  );
}
