import React, { useEffect, useRef } from 'react';
import { Map, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gsap } from 'gsap';
import "./Hero.css";

const Hero = () => {
  const scrollToHotels = () => {
    const hotelsSection = document.getElementById('hotels-section');
    if (hotelsSection) {
      hotelsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const watermarkRef = useRef(null);

  useEffect(() => {
    // gentle floating animation for the watermark using GSAP
    if (!watermarkRef.current) return;

    // Disable vertical float on small screens to keep watermark static
    const isMobile = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 640px)').matches;
    if (isMobile) {
      gsap.set(watermarkRef.current, { y: 0 });
      return;
    }

    const anim = gsap.to(watermarkRef.current, { y: -18, duration: 6, ease: 'sine.inOut', repeat: -1, yoyo: true });
    return () => {
      if (anim) anim.kill();
    };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Preload critical hero image for faster LCP */}
      <link rel="preload" as="image" href="/bg-hero.webp" fetchpriority="high" />
      
      {/* Background Image - Extends to top */}
      <div className="absolute inset-0 top-0">
        <img
          src="/bg-hero.webp"
          alt="Sri Lanka hotels background"
          className="absolute inset-0 w-full h-full object-cover object-top"
          loading="eager"
          fetchpriority="high"
          decoding="async"
        />
        {/* Dark Overlay - reduced opacity so sky is more visible */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content: align left-bottom so headline + CTAs appear in left bottom of hero */}
      <div className="relative z-10 flex h-full flex-col items-start justify-end px-4 text-left">
        {/* Large Hotello Text Overlay - Positioned to the right in sky area like StayGo */}
        <div className="absolute top-28 sm:top-20 right-0 left-0 flex items-start justify-center sm:justify-end pr-4 sm:pr-8 md:pr-16 lg:pr-24 pointer-events-none">
          <h1 ref={watermarkRef} className="hero-title-overlay text-center sm:text-right">
            Hotello
          </h1>
        </div>

        {/* Main Content (left-bottom) */}
        <div className="relative z-20 mb-12 w-full max-w-3xl pl-4 md:pl-8 lg:pl-16">
          {/* Headline */}
          <h2 className="mb-6 text-4xl font-normal leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Find Your Perfect Stay<br />at the Best Price
          </h2>

          {/* CTA Buttons - left aligned and placed near bottom-left */}
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div>
              <Button
                size="lg"
                onClick={scrollToHotels}
                className="group rounded-full bg-gradient-gold px-6 py-3 text-base font-semibold text-gray-900 shadow-2xl transition-all hover:scale-105 hover:shadow-xl border-0"
              >
                <Map className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                Explore Destinations
              </Button>
            </div>

            <div>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => window.location.href = '/chat'}
                className="rounded-full border-2 border-white/30 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-lg transition-all hover:scale-105 hover:border-white/50 hover:bg-white/20"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Ask Hotello AI
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
