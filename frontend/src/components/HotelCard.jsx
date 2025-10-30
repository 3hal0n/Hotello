import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function HotelCard({ hotel }) {
  const cardRef = useRef(null);
  const glareRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current || !glareRef.current) return;

    const card = cardRef.current;
    const glare = glareRef.current;
    const rect = card.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    
    glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.3), transparent 50%)`;
    glare.style.opacity = '1';
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !glareRef.current) return;
    
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    glareRef.current.style.opacity = '0';
  };

  // Use local image assets instead of online URLs
  const getLocalImage = () => {
    if (!hotel.name) return null;
    // Convert hotel name to folder name (lowercase, spaces to hyphens)
    const folderName = hotel.name.toLowerCase().replace(/\s+/g, '-');
    // Use first image by default (img1.jpg)
    return `/assets/img/${folderName}/img1.jpg`;
  };

  const [imgSrc, setImgSrc] = useState(getLocalImage());
  const [imgError, setImgError] = useState(false);

  const handleImgError = () => {
    setImgError(true);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="hotel-card bg-white rounded-xl shadow-md overflow-hidden group relative transition-all duration-300"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Glare Effect Overlay */}
      <div
        ref={glareRef}
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300 opacity-0 rounded-xl"
        style={{ mixBlendMode: 'overlay' }}
      />

      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        {imgSrc && !imgError ? (
          <img
            src={imgSrc}
            onError={handleImgError}
            alt={hotel.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-500 text-sm mt-2">{hotel.name}</span>
            </div>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6 relative">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
          {hotel.name}
        </h2>
        
        <p className="text-gray-600 mb-2 flex items-center">
          <svg className="w-4 h-4 mr-1 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          {hotel.location}
        </p>

        {hotel.rating > 0 && (
          <div className="flex items-center mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(hotel.rating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">{hotel.rating.toFixed(1)}</span>
          </div>
        )}

        <p className="text-gray-700 mb-4 line-clamp-2 text-sm leading-relaxed">
          {hotel.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">From</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ${hotel.pricePerNight}
              <span className="text-sm text-gray-500 font-normal">/night</span>
            </p>
          </div>
          
          <Link
            to={`/hotels/${hotel._id}`}
            className="animated-button relative px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg overflow-hidden group/btn transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/50"
          >
            <span className="relative z-10">View Details</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-[-100%] group-hover/btn:translate-x-[200%] transition-transform duration-700" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
