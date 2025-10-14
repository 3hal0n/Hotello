import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE || ''}/api/hotels`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setHotels(data.data || []);
        } else {
          setError('Failed to load hotels');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to connect to server');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-gray-600">Loading hotels...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Find Your Perfect Stay</h1>
        
        {hotels.length === 0 ? (
          <p className="text-center text-gray-600">No hotels available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <div key={hotel._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                {hotel.images && hotel.images[0] ? (
                  <img 
                    src={hotel.images[0].url} 
                    alt={hotel.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
                
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">{hotel.name}</h2>
                  <p className="text-gray-600 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {hotel.location}
                  </p>
                  
                  {hotel.rating > 0 && (
                    <div className="flex items-center mb-3">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 text-gray-700">{hotel.rating.toFixed(1)}</span>
                    </div>
                  )}
                  
                  <p className="text-gray-700 mb-4 line-clamp-2">{hotel.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">From</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ${hotel.pricePerNight}
                        <span className="text-sm text-gray-500 font-normal">/night</span>
                      </p>
                    </div>
                    <Link 
                      to={`/hotels/${hotel._id}`}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
