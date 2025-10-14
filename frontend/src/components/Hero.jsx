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

        {/* Glassmorphism Search Bar */}
        <div className="w-full max-w-3xl animate-float">
          {/* Mode Toggle */}
          <div className="mb-4 flex justify-center gap-3">
            <Button
              variant={searchMode === "destination" ? "default" : "ghost"}
              onClick={() => setSearchMode("destination")}
              className={`rounded-full ${
                searchMode === "destination"
                  ? "bg-gradient-gold text-primary-foreground"
                  : "text-primary-foreground/70 hover:text-primary-foreground"
              }`}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Destination
            </Button>
            <Button
              variant={searchMode === "emotion" ? "default" : "ghost"}
              onClick={() => setSearchMode("emotion")}
              className={`rounded-full ${
                searchMode === "emotion"
                  ? "bg-gradient-gold text-primary-foreground"
                  : "text-primary-foreground/70 hover:text-primary-foreground"
              }`}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              AI Emotion
            </Button>
          </div>

          {/* Search Input */}
          <div className="group relative rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] p-2 shadow-2xl backdrop-blur-glass transition-all hover:scale-[1.02]">
            <div className="flex items-center gap-3 px-4">
              {searchMode === "destination" ? (
                <MapPin className="h-5 w-5 text-gold" />
              ) : (
                <Sparkles className="h-5 w-5 text-gold" />
              )}
              <Input
                type="text"
                placeholder={
                  searchMode === "destination"
                    ? "Where would you like to go?"
                    : "How are you feeling? (e.g., 'adventurous', 'peaceful')"
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 border-0 bg-transparent text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button
                onClick={handleSearch}
                className="rounded-full bg-gradient-gold px-6 py-2 font-medium text-primary transition-all hover:scale-105 hover:shadow-lg"
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>

          {/* Example Searches */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => {
                setSearchMode("emotion");
                setSearchQuery("romantic getaway in Paris");
              }}
              className="rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm text-primary-foreground/70 backdrop-blur-sm transition-all hover:bg-primary-foreground/20 hover:text-primary-foreground"
            >
              "romantic getaway in Paris"
            </button>
            <button
              onClick={() => {
                setSearchMode("emotion");
                setSearchQuery("calm mountain retreat");
              }}
              className="rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm text-primary-foreground/70 backdrop-blur-sm transition-all hover:bg-primary-foreground/20 hover:text-primary-foreground"
            >
              "calm mountain retreat"
            </button>
            <button
              onClick={() => {
                setSearchMode("emotion");
                setSearchQuery("adventurous escape");
              }}
              className="rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm text-primary-foreground/70 backdrop-blur-sm transition-all hover:bg-primary-foreground/20 hover:text-primary-foreground"
            >
              "adventurous escape"
            </button>
          </div>
        </div>

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
