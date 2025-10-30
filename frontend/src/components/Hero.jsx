import { useState, useEffect } from "react";
import { Sparkles, Map, ChevronDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import hotel1 from "@/assets/hotel-1.jpg";
import hotel2 from "@/assets/hotel-2.jpg";
import hotel3 from "@/assets/hotel-3.jpg";
import hotel4 from "@/assets/hotel-4.jpg";
import "./Hero.css";

const slides = [
  {
    image: hotel1,
    mood: "romantic",
    title: "Find Hotels That Match Your Mood",
    subtitle: "Experience luxury tailored to your emotions",
  },
  {
    image: hotel2,
    mood: "adventure",
    title: "Book Luxury. Feel Inspired.",
    subtitle: "Where comfort meets elegance",
  },
  {
    image: hotel3,
    mood: "peaceful",
    title: "Discover the Perfect Stay — Powered by AI",
    subtitle: "Your dream destination awaits",
  },
  {
    image: hotel4,
    mood: "urban",
    title: "Escape to Extraordinary",
    subtitle: "Redefine your travel experience",
  },
];

const moods = [
  { id: "romantic", label: "Romantic", icon: "💕", query: "romantic couples intimate cozy candlelit" },
  { id: "adventure", label: "Adventure", icon: "🏔️", query: "adventure activities exciting outdoor thrilling" },
  { id: "peaceful", label: "Peaceful", icon: "🧘", query: "peaceful relaxing spa wellness quiet serene" },
  { id: "urban", label: "Urban Chic", icon: "🌆", query: "urban city modern downtown skyline metropolitan" },
  { id: "beach", label: "Beach Escape", icon: "🏖️", query: "beach ocean seaside coastal beachfront" },
];

const Hero = ({ onEmotionSearch }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedMood, setSelectedMood] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood.id);
    const slideIndex = slides.findIndex((slide) => slide.mood === mood.id);
    if (slideIndex !== -1) {
      setCurrentSlide(slideIndex);
    }
    // Trigger emotion search
    if (onEmotionSearch) {
      onEmotionSearch(mood.query);
    }
  };

  const scrollToHotels = () => {
    const hotelsSection = document.getElementById('hotels-section');
    if (hotelsSection) {
      hotelsSection.scrollIntoView({ behavior: 'smooth' });
    }
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
        <div className="mb-6 animate-fade-in">
          <h1 className="font-serif text-5xl font-light tracking-wider text-primary-foreground md:text-7xl">
            Hotello
          </h1>
          <div className="mx-auto mt-2 h-px w-32 bg-gradient-gold" />
        </div>

        {/* Headline + Subheadline */}
        <div className="mb-8 max-w-4xl animate-fade-in-delay">
          <h2 className="mb-4 text-4xl font-light leading-tight text-primary-foreground md:text-6xl">
            {slides[currentSlide].title}
          </h2>
          <p className="text-lg text-primary-foreground/80 md:text-xl">
            {slides[currentSlide].subtitle}
          </p>
        </div>

        {/* Mood Selector Chips */}
        <div className="mb-8 flex flex-wrap justify-center gap-3 animate-fade-in-delay-2">
          {moods.map((mood) => (
            <button
              key={mood.id}
              onClick={() => handleMoodSelect(mood)}
              className={`group relative rounded-full border px-6 py-2.5 backdrop-blur-glass transition-all hover:scale-105 active:scale-95 ${
                selectedMood === mood.id
                  ? "border-gold bg-gradient-gold text-primary shadow-lg"
                  : "border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:border-gold-light hover:bg-primary-foreground/20"
              }`}
            >
              <span className="mr-2 text-lg">{mood.icon}</span>
              <span className="text-sm font-medium">{mood.label}</span>
            </button>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row animate-fade-in-delay-3">
          <Button
            size="lg"
            onClick={scrollToHotels}
            className="group rounded-full bg-gradient-gold px-8 py-6 text-base font-medium text-primary shadow-2xl transition-all hover:scale-105 hover:shadow-xl"
          >
            <Map className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
            Explore Destinations
          </Button>
          <Button
            size="lg"
            variant="ghost"
            onClick={scrollToHotels}
            className="rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-8 py-6 text-base font-medium text-primary-foreground backdrop-blur-glass transition-all hover:scale-105 hover:border-gold hover:bg-primary-foreground/20"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Ask Hotello AI
          </Button>
        </div>

        {/* Trust Badge */}
        <div className="mb-12 flex items-center gap-2 rounded-full border border-gold/30 bg-primary-foreground/5 px-6 py-2 backdrop-blur-glass animate-fade-in-delay-4">
          <Star className="h-4 w-4 fill-gold text-gold" />
          <span className="text-sm text-primary-foreground/90">
            Trusted by 120+ Luxury Hotels Worldwide
          </span>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-20 left-1/2 flex -translate-x-1/2 gap-2">
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

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow">
          <ChevronDown className="h-8 w-8 text-primary-foreground/60" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
