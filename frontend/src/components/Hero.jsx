import React, { useEffect, useRef } from 'react';
import { Map, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import "./Hero.css";

const Hero = ({ onEmotionSearch }) => {
  const scrollToHotels = () => {
    const hotelsSection = document.getElementById('hotels-section');
    if (hotelsSection) {
      hotelsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToChat = () => {
    const chatSection = document.querySelector('[href="/chat"]');
    if (chatSection) {
      chatSection.click();
    }
  };

  const watermarkRef = useRef(null);

  useEffect(() => {
    // gentle floating animation for the watermark using GSAP
    if (watermarkRef.current) {
      gsap.to(watermarkRef.current, { y: -18, duration: 6, ease: 'sine.inOut', repeat: -1, yoyo: true });
    }
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image - Extends to top */}
      <div className="absolute inset-0 top-0">
        <div
          className="absolute inset-0 bg-cover bg-top"
          style={{
            backgroundImage: `url(/bg-hero.jpg)`,
            backgroundPosition: 'top center',
            backgroundSize: 'cover',
          }}
        />
        {/* Dark Overlay - reduced opacity so sky is more visible */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content: align left-bottom so headline + CTAs appear in left bottom of hero */}
      <div className="relative z-10 flex h-full flex-col items-start justify-end px-4 text-left">
        {/* Large Hotello Text Overlay - Positioned to the right in sky area like StayGo */}
        <div className="absolute top-20 right-0 left-0 flex items-start justify-end pr-8 md:pr-16 lg:pr-24 pointer-events-none">
          <motion.h1 ref={watermarkRef} className="hero-title-overlay text-right" initial={{ opacity: 0.95, y: 0 }} animate={{ opacity: 0.95 }} transition={{ duration: 1 }}>
            Hotello
          </motion.h1>
        </div>

        {/* Main Content (left-bottom) */}
        <motion.div className="relative z-20 mb-12 w-full max-w-3xl pl-4 md:pl-8 lg:pl-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          {/* Headline */}
          <motion.h2 className="mb-6 text-4xl font-normal leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Find Your Perfect Stay<br />at the Best Price
          </motion.h2>

          {/* CTA Buttons - left aligned and placed near bottom-left */}
          <motion.div className="flex flex-col sm:flex-row gap-4 items-start"
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
