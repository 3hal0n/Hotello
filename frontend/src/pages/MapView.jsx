import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useApi from '../hooks/useApi';

export default function MapView(){
  const api = useApi();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    async function load(){
      setLoading(true);
      try{
        const res = await api.fetchHotels();
        if (res && res.success) setHotels(res.data);
      }catch(err){
        console.error(err);
      }finally{setLoading(false)}
    }
    load();
  },[]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Hotels Map View</h1>
          <p className="mb-4 text-gray-600">Click a hotel to open its location in Google Maps.</p>

          {loading ? <p>Loading...</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hotels.map(h => (
                <div key={h._id} className="bg-white rounded-lg p-4 shadow flex items-center gap-4">
                  <img src={h.images && h.images[0] ? h.images[0].url : '/hotel1.jpg'} alt={h.name} className="w-28 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{h.name}</h3>
                    <p className="text-sm text-gray-600">{h.location}</p>
                    {h.geo && h.geo.lat && h.geo.lng && (
                      <a className="text-blue-600 text-sm" href={`https://www.google.com/maps?q=${h.geo.lat},${h.geo.lng}`} target="_blank" rel="noreferrer">Open in Google Maps</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
