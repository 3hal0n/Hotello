import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function HotelDetails() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE || ''}/api/hotels/${id}`)
      .then((r) => r.json())
      .then((data) => setHotel(data.data))
      .catch(console.error);
  }, [id]);

  if (!hotel) return <div>Loading...</div>;

  return (
    <main>
      <h1>{hotel.name}</h1>
      <p>{hotel.description}</p>
      <p>Location: {hotel.location}</p>
      <p>Price per night: {hotel.pricePerNight}</p>
      <Link to={`/booking/${hotel._id}`}>Book now</Link>
    </main>
  );
}
