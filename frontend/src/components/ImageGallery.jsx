import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

export default function ImageGallery({ images, hotelName }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  };

  React.useEffect(() => {
    if (isLightboxOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isLightboxOpen, lightboxIndex]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-100 flex items-center justify-center rounded-2xl">
        <p className="text-gray-400 text-lg">No images available</p>
      </div>
    );
  }

  return (
    <>
      {/* Main Gallery Grid */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[600px] rounded-2xl overflow-hidden">
        {/* Large Image */}
        <div
          className="col-span-2 row-span-2 relative group cursor-pointer overflow-hidden bg-gray-900"
          onClick={() => openLightbox(selectedImage)}
        >
          <img
            src={images[selectedImage]?.url || images[selectedImage]}
            alt={`${hotelName} - Main view`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
            <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-12 h-12" />
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
              {selectedImage + 1} / {images.length}
            </span>
            <button className="text-white bg-black/50 p-2 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors">
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Smaller Images */}
        {images.slice(0, 4).map((image, index) => {
          if (index === selectedImage) return null;
          return (
            <div
              key={index}
              className={`relative group cursor-pointer overflow-hidden bg-gray-900 ${
                index === 3 ? 'col-span-2' : ''
              }`}
              onClick={() => setSelectedImage(index)}
              onMouseEnter={() => setSelectedImage(index)}
            >
              <img
                src={image?.url || image}
                alt={`${hotelName} - View ${index + 1}`}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Maximize2 className="text-white w-8 h-8" />
              </div>
            </div>
          );
        })}

        {/* View All Photos Button */}
        {images.length > 4 && (
          <div
            className="absolute bottom-4 right-4 z-10 cursor-pointer"
            onClick={() => openLightbox(0)}
          >
            <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              View All {images.length} Photos
            </button>
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
              index === selectedImage
                ? 'ring-4 ring-blue-500 scale-105'
                : 'ring-2 ring-gray-200 hover:ring-gray-400 hover:scale-105'
            }`}
          >
            <img
              src={image?.url || image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 text-white hover:text-gray-300 transition-colors p-2 hover:bg-white/10 rounded-full"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 text-white text-lg font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Previous Button */}
          <button
            onClick={prevImage}
            className="absolute left-4 z-50 text-white hover:text-gray-300 transition-all p-3 hover:bg-white/10 rounded-full hover:scale-110"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          {/* Next Button */}
          <button
            onClick={nextImage}
            className="absolute right-4 z-50 text-white hover:text-gray-300 transition-all p-3 hover:bg-white/10 rounded-full hover:scale-110"
            aria-label="Next image"
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          {/* Main Image */}
          <div className="w-full h-full flex items-center justify-center p-12">
            <img
              src={images[lightboxIndex]?.url || images[lightboxIndex]}
              alt={`${hotelName} - View ${lightboxIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Thumbnail Strip in Lightbox */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 overflow-x-auto max-w-3xl px-4 scrollbar-hide">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setLightboxIndex(index)}
                className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden transition-all duration-300 ${
                  index === lightboxIndex
                    ? 'ring-4 ring-white scale-110'
                    : 'ring-2 ring-gray-500 opacity-60 hover:opacity-100 hover:scale-105'
                }`}
              >
                <img
                  src={image?.url || image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
