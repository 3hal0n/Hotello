import { useState, useEffect } from "react";
import { Search, Sparkles, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import hotel1 from "@/assets/hotel-1.jpg";
import hotel2 from "@/assets/hotel-2.jpg";
import hotel3 from "@/assets/hotel-3.jpg";
import hotel4 from "@/assets/hotel-4.jpg";
import "./Hero.css";

const slides = [
  {
    image: hotel1,
    title: "Find Hotels That Match Your Mood",
    subtitle: "Experience luxury tailored to your emotions",
  },
  {
    image: hotel2,
    title: "Book Luxury. Feel Inspired.",
    subtitle: "Where comfort meets elegance",
  },
  {
    image: hotel3,
    title: "Discover the Perfect Stay — Powered by AI",
    subtitle: "Your dream destination awaits",
  },
  {
    image: hotel4,
    title: "Escape to Extraordinary",
    subtitle: "Redefine your travel experience",
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchMode, setSearchMode] = useState("destination");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const handleSearch = () => {
    console.log(`Searching ${searchMode}:`, searchQuery);
    // AI search logic would go here
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center animate-dome-rotate"
              style={{
                backgroundImage: `url(${slide.image})`,
                filter: index === currentSlide ? "blur(0px)" : "blur(8px)",
              }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-overlay" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        {/* Logo */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-serif text-5xl font-light tracking-wider text-primary-foreground md:text-7xl">
            Hotello
          </h1>
          <div className="mx-auto mt-2 h-px w-32 bg-gradient-gold" />
        </div>

        {/* Dynamic Title */}
        <div className="mb-12 animate-fade-in">
          <h2 className="mb-3 text-3xl font-light text-primary-foreground md:text-5xl">
            {slides[currentSlide].title}
          </h2>
          <p className="text-lg text-primary-foreground/80 md:text-xl">
            {slides[currentSlide].subtitle}
          </p>
        </div>

        {/* Search removed - moved to hotel section */}

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? "w-8 bg-gold"
                  : "w-2 bg-primary-foreground/30 hover:bg-primary-foreground/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
