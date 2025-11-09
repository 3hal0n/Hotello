import React, { useEffect, useRef, useState } from 'react';
import { Map, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';
import "./Hero.css";

const Hero = ({ onEmotionSearch }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  // Hero carousel images - using the provided images
  const heroImages = [
    '/hero-1.jpg', // Modern lakeside villa
    '/hero-2.jpg', // Mountain snow resort
    '/hero-3.jpg', // Urban rooftop lounge
  ];

  const scrollToHotels = () => {
    const hotelsSection = document.getElementById('hotels-section');
    if (hotelsSection) {
      hotelsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [currentSlide, isAutoPlaying]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  return (
    <section 
      className="relative h-screen w-full overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Carousel Background Images */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <img
              src={heroImages[currentSlide]}
              alt={`Hero slide ${currentSlide + 1}`}
              className="w-full h-full object-cover"
              loading="eager"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/30" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Carousel Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Carousel Indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              currentSlide === index 
                ? 'w-8 bg-white' 
                : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Content: align left-bottom */}
      <div className="relative z-10 flex h-full flex-col items-start justify-end px-4 text-left">
        {/* Static Hotello Text - No floating animation */}
        <div className="absolute top-20 right-0 left-0 flex items-start justify-end pr-8 md:pr-16 lg:pr-24 pointer-events-none">
          <motion.h1 
            className="hero-title-overlay text-right" 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 0.95, y: 0 }} 
            transition={{ duration: 0.8 }}
          >
            Hotello
          </motion.h1>
        </div>

        {/* Main Content (left-bottom) */}
        <motion.div 
          className="relative z-20 mb-12 w-full max-w-3xl pl-4 md:pl-8 lg:pl-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          {/* Headline */}
          <motion.h2 
            className="mb-6 text-4xl font-normal leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Find Your Perfect Stay<br />at the Best Price
          </motion.h2>

          {/* CTA Buttons - left aligned and placed near bottom-left */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 items-start"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                onClick={scrollToHotels}
                className="group rounded-full bg-gradient-gold px-6 py-3 text-base font-semibold text-gray-900 shadow-2xl transition-all hover:scale-105 hover:shadow-xl border-0"
              >
                <Map className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                Explore Destinations
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => window.location.href = '/chat'}
                className="rounded-full border-2 border-white/30 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-lg transition-all hover:scale-105 hover:border-white/50 hover:bg-white/20"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Ask Hotello AI
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
